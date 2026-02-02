import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from "@core/api/endpoints";
import {User} from "../models/user.model";

@Injectable({providedIn: 'root'})
export class SharedUserService {
    constructor(private readonly httpService: HttpService) {
    }

    searchUsers(attribute: string): Observable<User[]> {
        return this.httpService.request()
            .param('attribute', attribute ?? '')
            .get(ENDPOINTS.users.root);
    }

    findProvinces(): Observable<string[]> {
        return this.httpService.request()
            .get(ENDPOINTS.users.provinces())
            .pipe(
                map((response: { provinces: string[] }) => response.provinces)
            );
    }
}
