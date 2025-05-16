import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from "@env";
import {HttpService} from '@core/services/http.service';
import {UserSearch} from "./user-search.model";
import {User} from "../../shared/user.model";
import {AccessLink} from "./acces-link.model";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class UserService {
    private static readonly USERS = environment.REST_USER + '/users';
    private static readonly ACCESS_LINK = environment.REST_USER + '/access-link';
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

    readWithToken(mobile: string, token: string): Observable<User> {
        return this.httpService
            .get(UserService.USERS + UserService.MOBILE + '/' + mobile + '/' + token);
    }

    update(oldMobile: string, user: User): Observable<User> {
        return this.httpService
            .successful()
            .put(UserService.USERS + '/' + oldMobile, user);
    }

    updateWithToken(oldMobile: string, user: User, token: string): Observable<User> {
        console.log(oldMobile, user);
        return this.httpService
            .successful()
            .put(UserService.USERS + '/' + oldMobile + "/" + token, user);
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

    createAccessLink(accessLink: AccessLink): Observable<AccessLink> {
        return this.httpService.post(UserService.ACCESS_LINK, accessLink)
            .pipe(
                map(accessLink => {
                    accessLink.value = "http://localhost:4200/customer/edit-profile" + accessLink.value;
                    return accessLink;
                }),
            );
    }
}
