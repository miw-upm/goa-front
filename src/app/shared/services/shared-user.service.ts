import {Injectable} from '@angular/core';

import {environment} from "@env";
import {HttpService} from '@common/services/http.service';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class SharedUserService {
    private static readonly USERS = environment.REST_USER + '/users';

    constructor(private readonly httpService: HttpService) {
    }

    searchUsers(attribute: string): Observable<string[]> {
        return this.httpService
            .param("attribute", attribute ?? '')
            .get(SharedUserService.USERS)
            .pipe(
                map(users =>
                    users.map((user => `${user.mobile}: ${user.firstName} ${user.familyName}, ${user.email}`))
                )
            )
    }
}
