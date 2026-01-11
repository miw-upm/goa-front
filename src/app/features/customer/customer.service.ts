import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {User} from "../common/models/user.model";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable()
export class CustomerService {
    constructor(private readonly httpService: HttpService) {
    }

    readWithToken(mobile: string, token: string): Observable<User> {
        return this.httpService.request().get(ENDPOINTS.users.byMobileAndToken(mobile, token));
    }

    updateWithToken(oldMobile: string, user: User, token: string): Observable<User> {
        return this.httpService.request().successful().put(ENDPOINTS.users.byMobileAndToken(oldMobile, token), user);
    }

}
