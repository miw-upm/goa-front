import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {LegalProcedureTemplate} from './models/legal-procedure-template.model';
import {LegalProcedureFindCriteria} from './models/legal-procedure-find-criteria.model';


@Injectable({providedIn: 'root'})
export class LegalProcedureTemplateService {
    constructor(private readonly httpService: HttpService) {
    }

    create(procedure: LegalProcedureTemplate): Observable<LegalProcedureTemplate> {
        return this.httpService.request()
            .post(ENDPOINTS.legalProcedureTemplates.root, procedure);
    }

    update(id: string, procedure: LegalProcedureTemplate): Observable<LegalProcedureTemplate> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.legalProcedureTemplates.byId(id), procedure);
    }

    search(criteria: LegalProcedureFindCriteria): Observable<LegalProcedureTemplate[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get<LegalProcedureTemplate[]>(ENDPOINTS.legalProcedureTemplates.root);
    }

    read(id: string): Observable<LegalProcedureTemplate> {
        return this.httpService.request()
            .get<LegalProcedureTemplate>(ENDPOINTS.legalProcedureTemplates.byId(id));
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.legalProcedureTemplates.byId(id));
    }
}