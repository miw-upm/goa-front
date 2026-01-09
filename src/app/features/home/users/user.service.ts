import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from "@env";
import {HttpService} from '@core/http/http.service';
import {User} from "@shared/models/user.model";
import {UserSearch} from "./user-search.model";

@Injectable({providedIn: 'root'})
export class UserService {
    private static readonly API_URL = environment.REST_USER + '/users';

    constructor(private readonly httpService: HttpService) {
    }

    create(user: User): Observable<User> {
        return this.httpService
            .post(UserService.API_URL, user);
    }

    read(mobile: string): Observable<User> {
        return this.httpService
            .get(UserService.API_URL + '/' + mobile);
    }

    update(oldMobile: string, user: User): Observable<User> {
        return this.httpService
            .successful()
            .put(UserService.API_URL + '/' + oldMobile, user);
    }

    search(criteria: UserSearch): Observable<User[]> {
        return this.httpService
            .paramsFrom(criteria)
            .get(UserService.API_URL)
    }

}
