import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@shared/ui/api/http.service';
import {
    AdministrativeAuthorization
} from '../../../home/administrative-authorization/models/administrative-authorization.model';
import {SignAdministrativeAuthorization} from './sign-administrative-authorization.model';

@Injectable({providedIn: 'root'})
export class SignAdministrativeAuthorizationService {
    constructor(private readonly httpService: HttpService) {
    }

    readAuthorization(scope: string, urlId: string, token: string): Observable<AdministrativeAuthorization> {
        return this.httpService.request()
            .get(ENDPOINTS.administrativeAuthorizations.signerDocument(scope, urlId, token));
    }

    signAuthorization(scope: string, urlId: string, token: string,
                      signature: SignAdministrativeAuthorization): Observable<void> {
        return this.httpService.request()
            .success('Autorizacion firmada')
            .silentErrors()
            .warning()
            .patch(ENDPOINTS.administrativeAuthorizations.signerDocument(scope, urlId, token), signature);
    }
}
