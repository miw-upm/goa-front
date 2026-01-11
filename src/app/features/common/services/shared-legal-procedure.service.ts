import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpService} from '@core/http/http.service';

import {LegalProcedureTemplate} from "../models/legal-procedure-template.model";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable({providedIn: 'root'})
export class SharedLegalProcedureService {
    constructor(private readonly httpService: HttpService) {
    }

    searchProcedures(title: string): Observable<LegalProcedureTemplate[]> {
        return this.httpService.request()
            .param('title', title ?? '')
            .get(ENDPOINTS.legalProcedureTemplates.root);
    }
}
