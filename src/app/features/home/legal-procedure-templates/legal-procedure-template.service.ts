import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {LegalProcedureTemplate} from '@features/shared/models/legal-procedure-template.model';
import {LegalProcedureSearch} from './legal-procedure-search.model';


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

    search(legalProcedureSearch: LegalProcedureSearch): Observable<LegalProcedureTemplate[]> {
        return this.httpService.request()
            .paramsFrom(legalProcedureSearch)
            .get<LegalProcedureTemplate[]>(ENDPOINTS.legalProcedureTemplates.root)
            .pipe(
                map((procedures) =>
                    procedures.map(procedure => ({
                        ...procedure,
                        legalTasks: procedure.legalTasks.map(task => ({title: task.title}))
                    }))
                )
            );
    }

    read(id: string): Observable<LegalProcedureTemplate> {
        return this.httpService.request()
            .get<LegalProcedureTemplate>(ENDPOINTS.legalProcedureTemplates.byId(id))
            .pipe(
                map(procedure => ({
                    ...procedure,
                    legalTasks: procedure.legalTasks.map(task => ({title: task.title}))
                }))
            );
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.legalProcedureTemplates.byId(id));
    }
}