import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from "@core/api/endpoints";
import {User} from "@features/shared/models/user.model";
import {SharedCustomerService} from "@features/shared/services/shared-customer.service";
import {DataProcessingConsentCreation} from "./processing-consent-creation.model";

@Injectable({providedIn: 'root'})
export class CustomerService {
    constructor(private readonly httpService: HttpService,
                private readonly sharedCustomerService: SharedCustomerService,) {
    }

    readWithToken(scope: string, urlId: string, token: string): Observable<User> {
        return this.sharedCustomerService.readWithToken(scope, urlId, token);
    }

    updateWithToken(scope: string, urlId: string, token: string, user: User, dataProcessingConsentCreation: DataProcessingConsentCreation): Observable<User> {
        const body = {
            user: user,
            dataProcessingConsentCreation: dataProcessingConsentCreation
        };
        return this.httpService.request()
            .silentErrors()
            .put(ENDPOINTS.users.byToken(scope, urlId, token), body);
    }

}
