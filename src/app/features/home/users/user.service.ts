import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';

import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {User} from '@features/shared/models/user.model';
import {UserFindCriteria} from './user-find-criteria.model';
import {switchMap} from "rxjs/operators";
import {SharedAccessLinkService} from "@features/shared/services/shared-access-link.service";
import {Role} from "@core/auth/models/role.model";
import {SharedUserService} from "@features/shared/services/shared-user.service";

@Injectable({providedIn: 'root'})
export class UserService {
    private readonly EDIT_PROFILE_SCOPE = 'edit-profile';

    constructor(private readonly httpService: HttpService,
                private readonly sharedAccessLinkService: SharedAccessLinkService,
                private readonly sharedUserService: SharedUserService) {
    }

    create(user: User): Observable<User> {
        return this.httpService.request()
            .post(ENDPOINTS.users.root, user);
    }

    read(mobile: string): Observable<User> {
        return this.httpService.request()
            .get(ENDPOINTS.users.byMobile(mobile));
    }

    update(oldMobile: string, user: User): Observable<User> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.users.byMobile(oldMobile), user);
    }

    search(criteria: UserFindCriteria): Observable<User[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.users.root);
    }

    createAccessLink(user: User): Observable<string> {
        return this.read(user.mobile)
            .pipe(
                switchMap(retrievedUser => {
                    if (retrievedUser.role !== Role.CUSTOMER) {
                        return throwError(() => new Error('Sólo se puede crear links a los clientes'));
                    }
                    return this.sharedAccessLinkService.createAccessLink({
                        scope: this.EDIT_PROFILE_SCOPE,
                        mobile: retrievedUser.mobile,
                        documentId: null
                    });
                })
            );
    }

    searchAllJson() {
        return this.httpService.request().openJson(ENDPOINTS.users.findAllJson());
    }
}
