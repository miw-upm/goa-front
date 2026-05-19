import {Injectable} from '@angular/core';
import {filter, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';

import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {SharedAccessLinkService} from '@features/shared/services/shared-access-link.service';
import {User} from '@features/shared/models/user.model';
import {AdministrativeAuthorization} from './models/administrative-authorization.model';
import {AdministrativeAuthorizationFindCriteria} from './models/administrative-authorization-find-criteria.model';
import {SelectSignerDialogComponent} from './dialogs/select-signer-dialog.component';

@Injectable({providedIn: 'root'})
export class AdministrativeAuthorizationService {
    private readonly SIGN_SCOPE = 'sign-administrative-authorization';

    constructor(private readonly httpService: HttpService,
                private readonly sharedAccessLinkService: SharedAccessLinkService,
                private readonly dialog: MatDialog) {
    }

    create(authorization: AdministrativeAuthorization): Observable<AdministrativeAuthorization> {
        return this.httpService.request()
            .post(ENDPOINTS.administrativeAuthorizations.root, authorization);
    }

    read(id: string): Observable<AdministrativeAuthorization> {
        return this.httpService.request()
            .get(ENDPOINTS.administrativeAuthorizations.byId(id));
    }

    update(id: string, authorization: AdministrativeAuthorization): Observable<void> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.administrativeAuthorizations.byId(id), authorization);
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.administrativeAuthorizations.byId(id));
    }

    search(criteria: AdministrativeAuthorizationFindCriteria): Observable<AdministrativeAuthorization[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.administrativeAuthorizations.root);
    }

    print(id: string): Observable<void> {
        return this.httpService.request()
            .openPdf(ENDPOINTS.administrativeAuthorizations.view(id));
    }

    createAccessLink(authorization: AdministrativeAuthorization): Observable<string> {
        return this.pendingSigners(authorization).pipe(
            switchMap(users => this.askSignerSelection(users)),
            filter((user): user is User => !!user),
            switchMap(user => this.sharedAccessLinkService.createAccessLink({
                scope: this.SIGN_SCOPE,
                mobile: user.mobile,
                documentId: authorization.id
            }))
        );
    }

    pendingSigners(authorization: AdministrativeAuthorization): Observable<User[]> {
        return this.httpService.request()
            .warning()
            .get<User[]>(ENDPOINTS.administrativeAuthorizations.pendingSigners(authorization.id));
    }

    private askSignerSelection(users: User[]): Observable<User | undefined> {
        return this.dialog.open(SelectSignerDialogComponent, {
            data: {users}
        }).afterClosed();
    }
}
