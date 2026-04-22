import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';

import {ConsentSearch} from './consent-search.model';
import {Consent} from "./consent.model";

@Injectable({providedIn: 'root'})
export class ConsentService {
    constructor(private readonly httpService: HttpService) {
    }

    read(id: string): Observable<Consent> {
        return this.httpService.request()
            .get(ENDPOINTS.consents.byId(id));
    }

    search(criteria: ConsentSearch): Observable<Consent[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.consents.root);
    }
}
