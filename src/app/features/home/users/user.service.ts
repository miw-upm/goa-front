import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from "@env";
import {HttpService} from '@common/services/http.service';
import {UserSearch} from "./pages/user-search.model";
import {User} from "@shared/models/user.model";

@Injectable({providedIn: 'root'})
export class UserService {
    private static readonly API_URL = environment.REST_USER + '/users';
    private static readonly MOBILE = '/mobile';

    constructor(private readonly httpService: HttpService) {
    }

    create(user: User): Observable<User> {
        return this.httpService
            .post(UserService.API_URL, user);
    }

    read(mobile: string): Observable<User> {
        return this.httpService
            .get(UserService.API_URL + UserService.MOBILE + '/' + mobile);
    }

    update(oldMobile: string, user: User): Observable<User> {
        return this.httpService
            .successful()
            .put(UserService.API_URL + UserService.MOBILE + '/' + oldMobile, user);
    }

    search(criteria: UserSearch): Observable<User[]> {
        return this.httpService
            .paramsFrom(criteria)
            .get(UserService.API_URL)
    }

}
