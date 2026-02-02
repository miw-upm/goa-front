import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {User} from '@features/shared/models/user.model';
import {UserSearch} from './user-search.model';

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private readonly httpService: HttpService) {
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

    search(criteria: UserSearch): Observable<User[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.users.root);
    }

}
