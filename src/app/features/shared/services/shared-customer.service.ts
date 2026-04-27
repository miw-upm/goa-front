import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from "@core/api/endpoints";
import {User} from "../models/user.model";

@Injectable({providedIn: 'root'})
export class SharedCustomerService {
    constructor(private readonly httpService: HttpService) {
    }

    readWithToken(mobile: string, token: string): Observable<User> {
        return this.httpService.request().get(ENDPOINTS.users.byMobileAndToken(mobile, token));
    }

}
