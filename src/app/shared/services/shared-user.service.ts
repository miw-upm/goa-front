import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {environment} from "@env";
import {HttpService} from '@core/http/http.service';
import {User} from "@shared/models/user.model";

@Injectable({providedIn: 'root'})
export class SharedUserService {
    private static readonly API_URL = environment.REST_USER + '/users';
    private static readonly PROVINCES = '/provinces';

    constructor(private readonly httpService: HttpService) {
    }

    searchUsers(attribute: string): Observable<User[]> {
        return this.httpService
            .param("attribute", attribute ?? '')
            .get(SharedUserService.API_URL)
    }

    findProvinces(): Observable<string[]> {
        return this.httpService
            .get(SharedUserService.API_URL + SharedUserService.PROVINCES)
            .pipe(
                map(response => response.provinces)
            );
    }
}
