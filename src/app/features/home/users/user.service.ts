import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from "@env";
import {HttpService} from '@core/services/http.service';
import {UserSearch} from "./user-search.model";
import {User} from "./user.model";


@Injectable({providedIn: 'root'})
export class UserService {
    private static readonly USERS = environment.REST_USER + '/users';
    private static readonly MOBILE = '/mobile';
    private static readonly DOCUMENT_TYPES = '/document-types';

    constructor(private readonly httpService: HttpService) {
    }

    create(user: User): Observable<User> {
        return this.httpService
            .post(UserService.USERS, user);
    }

    read(mobile: string): Observable<User> {
        return this.httpService
            .get(UserService.USERS + UserService.MOBILE + '/' + mobile);
    }

    update(oldMobile: string, user: User): Observable<User> {
        return this.httpService
            .successful()
            .put(UserService.USERS + '/' + oldMobile, user);
    }

    search(userSearch: UserSearch): Observable<User[]> {
        return this.httpService
            .paramsFrom(userSearch)
            .get(UserService.USERS)
    }

    findDocumentTypes(): Observable<string[]> {
        return this.httpService
            .get(UserService.USERS + UserService.DOCUMENT_TYPES);
    }

}
