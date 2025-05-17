import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from "@env";
import {HttpService} from '@core/services/http.service';
import {User} from "../shared/user.model";

@Injectable({providedIn: 'root'})
export class CustomerService {
    private static readonly USERS = environment.REST_USER + '/users';
    private static readonly MOBILE = '/mobile';

    constructor(private readonly httpService: HttpService) {
    }

    readWithToken(mobile: string, token: string): Observable<User> {
        return this.httpService
            .get(CustomerService.USERS + CustomerService.MOBILE + '/' + mobile + '/' + token);
    }

    updateWithToken(oldMobile: string, user: User, token: string): Observable<User> {
        console.log(oldMobile, user);
        return this.httpService
            .successful()
            .put(CustomerService.USERS + CustomerService.MOBILE + '/' + oldMobile + "/" + token, user);
    }

}
