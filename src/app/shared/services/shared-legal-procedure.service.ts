import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {environment} from "@env";
import {HttpService} from '@core/http/http.service';

import {LegalProcedureTemplate} from "../models/legal-procedure-template.model";

@Injectable({providedIn: 'root'})
export class SharedLegalProcedureService {
    private static readonly API_URL = environment.REST_ENGAGEMENT + '/legal-procedure-templates';

    constructor(private readonly httpService: HttpService) {
    }

    searchProcedures(title: string): Observable<LegalProcedureTemplate[]> {
        return this.httpService
            .param("title", title ?? '')
            .get(SharedLegalProcedureService.API_URL)
    }
}
