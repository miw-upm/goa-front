import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";

import {environment} from "@env";
import {HttpService} from "@core/http/http.service";
import {LegalProcedureTemplate} from '@shared/models/legal-procedure-template.model';
import {LegalProcedureSearch} from "./models/legal-procedure-search.model";

@Injectable({providedIn: 'root'})
export class LegalProcedureTemplateService {
    private static readonly API_URL = environment.REST_ENGAGEMENT + '/legal-procedure-templates';

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
            .get(LegalProcedureTemplateService.API_URL)
            .pipe(
                map((procedures) =>
                    procedures.map(procedure => ({
                        ...procedure,
                        legalTasks: procedure.legalTasks.map(task => ({title: task.title}))
                    }))
                )
            );
    }

    delete(id: string): Observable<void> {
        return this.httpService
            .successful()
            .delete(LegalProcedureTemplateService.API_URL + `/${id}`);
    }

    read(id: string) {
        return this.httpService
            .get(LegalProcedureTemplateService.API_URL + '/' + `/${id}`)
            .pipe(
                map(procedure => ({
                    ...procedure,
                    legalTasks: procedure.legalTasks.map(task => ({title: task.title}))
                }))
            );
    }
}
