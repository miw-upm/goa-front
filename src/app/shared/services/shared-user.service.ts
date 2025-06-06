import {Injectable} from '@angular/core';

import {environment} from "@env";
import {HttpService} from '@common/services/http.service';
import {Observable} from "rxjs";
import {User} from "@shared/models/user.model";


@Injectable({providedIn: 'root'})
export class SharedUserService {
    private static readonly USERS = environment.REST_USER + '/users';

    constructor(private readonly httpService: HttpService) {
    }

    searchUsers(attribute: string): Observable<User[]> {
        return this.httpService
            .param("attribute", attribute ?? '')
            .get(SharedUserService.USERS)
    }
}
