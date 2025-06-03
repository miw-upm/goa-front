import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {LegalProcedureTemplate} from './legal-procedure-template.model';
import {HttpService} from "@common/services/http.service";
import {LegalProcedureSearch} from "./pages/legal-procedure-search.model";
import {environment} from "@env";

@Injectable({providedIn: 'root'})
export class LegalProcedureTemplateService {
    private static readonly API_URL = environment.REST_ENCARGO + '/legal-procedure-templates';

    constructor(private readonly httpService: HttpService) {
    }

    create(procedure: LegalProcedureTemplate): Observable<LegalProcedureTemplate> {
        return this.httpService
            .post(LegalProcedureTemplateService.API_URL, procedure);
    }

    update(id: string, procedure: LegalProcedureTemplate): Observable<LegalProcedureTemplate> {
        return this.httpService
            .successful()
            .put(LegalProcedureTemplateService.API_URL + `/${id}`, procedure);
    }

    search(legalProcedureSearch: LegalProcedureSearch): Observable<LegalProcedureTemplate[]> {
        return this.httpService
            .paramsFrom(legalProcedureSearch)
            .get(LegalProcedureTemplateService.API_URL);
    }

    getById(id: string): Observable<LegalProcedureTemplate> {
        return this.httpService
            .get(LegalProcedureTemplateService.API_URL + `/${id}`);
    }

    delete(id: string): Observable<void> {
        return this.httpService
            .successful()
            .delete(LegalProcedureTemplateService.API_URL + `/${id}`);
    }

    read(id: string) {
        return this.httpService
            .get(LegalProcedureTemplateService.API_URL + '/' + `/${id}`);
    }
}
