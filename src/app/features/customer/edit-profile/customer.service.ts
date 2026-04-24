import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from "@core/api/endpoints";
import {User} from "@features/shared/models/user.model";
import {DataProcessingConsentCreation} from "./ProcessingConsentCreation.model";

@Injectable({ providedIn: 'root' })
export class CustomerService {
    constructor(private readonly httpService: HttpService) {
    }

    readWithToken(mobile: string, token: string): Observable<User> {
        return this.httpService.request().get(ENDPOINTS.users.byMobileAndToken(mobile, token));
    }

    updateWithToken(oldMobile: string, user: User, dataProcessingConsentCreation: DataProcessingConsentCreation,
                    token: string): Observable<User> {
        const body = {
            user: user,
            dataProcessingConsentCreation: dataProcessingConsentCreation
        };
        return this.httpService.request()
            .success(" PERFIL ACTUALIZADO!!! Si necesita cambiarlo, puede hacerlo, pero recuerde que el enlace caduca en 7 días.")
            .put(ENDPOINTS.users.byMobileAndToken(oldMobile, token), body);
    }

}
