import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from "@core/api/endpoints";
import {User} from "@features/shared/models/user.model";

@Injectable()
export class CustomerService {
    constructor(private readonly httpService: HttpService) {
    }

    readWithToken(mobile: string, token: string): Observable<User> {
        return this.httpService.request().get(ENDPOINTS.users.byMobileAndToken(mobile, token));
    }

    updateWithToken(oldMobile: string, user: User, token: string): Observable<User> {
        return this.httpService.request().success().put(ENDPOINTS.users.byMobileAndToken(oldMobile, token), user);
    }

}
