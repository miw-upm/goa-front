import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {EngagementLetter} from './models/engagement-letter.model';
import {EngagementLetterFindCriteria} from './models/engagement-letter-find-criteria.model';
import {User} from "@features/shared/models/user.model";
import {SharedAccessLinkService} from "@features/shared/services/shared-access-link.service";

@Injectable()
export class EngagementLetterService {
    private readonly SIGN_ENGAGEMENT_LETTER_SCOPE = 'sign-engagement-letter';
    private readonly ENGAGEMENT_LETTER_BUDGET_SCOPE = 'engagement-letter-budget';

    constructor(private readonly httpService: HttpService,
                private readonly sharedAccessLinkService: SharedAccessLinkService) {
    }

    create(engagement: EngagementLetter): Observable<EngagementLetter> {
        return this.httpService.request()
            .post(ENDPOINTS.engagementLetters.root, engagement);
    }

    update(id: string, engagement: EngagementLetter): Observable<void> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.engagementLetters.byId(id), engagement);
    }

    search(criteria: EngagementLetterFindCriteria): Observable<EngagementLetter[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.engagementLetters.root);
    }

    read(id: string): Observable<EngagementLetter> {
        return this.httpService.request()
            .get(ENDPOINTS.engagementLetters.byId(id));
    }

    print(id: string): Observable<void> {
        return this.httpService
            .request()
            .openPdf(ENDPOINTS.engagementLetters.view(id));
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.engagementLetters.byId(id));
    }

    createLetterAccessLink(engagement: EngagementLetter, user: User): Observable<string> {
        return this.sharedAccessLinkService.createAccessLink({
            mobile: user.mobile,
            scope: this.SIGN_ENGAGEMENT_LETTER_SCOPE,
            document: engagement.id
        });
    }

    pendingSigners(engagement: EngagementLetter): Observable<User[]> {
        return this.httpService.request()
            .warning()
            .get<User[]>(ENDPOINTS.engagementLetters.pendingSigners(engagement.id));
    }

    createBudgetAccessLink(engagement: EngagementLetter) {
        return this.sharedAccessLinkService.createAccessLink({
            mobile: engagement.owner.mobile,
            scope: this.ENGAGEMENT_LETTER_BUDGET_SCOPE,
            document: engagement.id
        });
    }
}