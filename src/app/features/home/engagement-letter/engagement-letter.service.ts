import {Injectable} from '@angular/core';
import {filter, Observable} from 'rxjs';

import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {EngagementLetter} from './models/engagement-letter.model';
import {EngagementLetterFindCriteria} from './models/engagement-letter-find-criteria.model';
import {User} from "@features/shared/models/user.model";
import {SharedAccessLinkService} from "@features/shared/services/shared-access-link.service";
import {switchMap} from "rxjs/operators";
import {SelectLetterLinkDialogComponent} from "./dialogs/select-letter-link-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable()
export class EngagementLetterService {
    private readonly SIGN_ENGAGEMENT_LETTER_SCOPE = 'sign-engagement-letter';
    private readonly ENGAGEMENT_LETTER_BUDGET_SCOPE = 'read-engagement-letter';

    constructor(private readonly httpService: HttpService,
                private readonly sharedAccessLinkService: SharedAccessLinkService,
                private readonly dialog: MatDialog) {
    }

    create(engagement: EngagementLetter): Observable<EngagementLetter> {
        return this.httpService.request()
            .post(ENDPOINTS.engagementLetters.root, engagement);
    }

    read(id: string): Observable<EngagementLetter> {
        return this.httpService.request()
            .get(ENDPOINTS.engagementLetters.byId(id));
    }

    update(id: string, engagement: EngagementLetter): Observable<void> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.engagementLetters.byId(id), engagement);
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.engagementLetters.byId(id));
    }

    search(criteria: EngagementLetterFindCriteria): Observable<EngagementLetter[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.engagementLetters.root);
    }

    print(id: string): Observable<void> {
        return this.httpService
            .request()
            .openPdf(ENDPOINTS.engagementLetters.view(id));
    }

    createAccessLink(engagement: EngagementLetter): Observable<string> {
        if (engagement.budgetOnly) {
            return this.createBudgetAccessLink(engagement);
        }
        return this.pendingSigners(engagement).pipe(
            switchMap(users => this.askSignerSelection(users)),
            filter((user): user is User => !!user),
            switchMap(user => this.createLetterAccessLink(engagement, user))
        );
    }

    createLetterAccessLink(engagement: EngagementLetter, user: User): Observable<string> {
        return this.sharedAccessLinkService.createAccessLink({
            scope: this.SIGN_ENGAGEMENT_LETTER_SCOPE,
            mobile: user.mobile,
            documentId: engagement.id
        });
    }

    pendingSigners(engagement: EngagementLetter): Observable<User[]> {
        return this.httpService.request()
            .warning()
            .get<User[]>(ENDPOINTS.engagementLetters.pendingSigners(engagement.id));
    }

    createBudgetAccessLink(engagement: EngagementLetter) {
        return this.sharedAccessLinkService.createAccessLink({
            scope: this.ENGAGEMENT_LETTER_BUDGET_SCOPE,
            mobile: engagement.owner.mobile,
            documentId: engagement.id
        });
    }

    private askSignerSelection(users: User[]): Observable<User | undefined> {
        return this.dialog.open(SelectLetterLinkDialogComponent, {
            data: {users}
        }).afterClosed();
    }
}