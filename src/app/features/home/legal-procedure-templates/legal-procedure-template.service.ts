import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {HttpService} from "@core/http/http.service";
import {LegalProcedureTemplate} from '../../common/models/legal-procedure-template.model';
import {LegalProcedureSearch} from "./legal-procedure-search.model";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable({providedIn: 'root'})
export class LegalProcedureTemplateService {
    constructor(private readonly httpService: HttpService) {
    }

    create(procedure: LegalProcedureTemplate): Observable<LegalProcedureTemplate> {
        return this.httpService
            .post(ENDPOINTS.legalProcedureTemplates.root, procedure);
    }

    update(id: string, procedure: LegalProcedureTemplate): Observable<LegalProcedureTemplate> {
        return this.httpService
            .successful()
            .put(ENDPOINTS.legalProcedureTemplates.byId(id), procedure);
    }

    search(legalProcedureSearch: LegalProcedureSearch): Observable<LegalProcedureTemplate[]> {
        return this.httpService
            .paramsFrom(legalProcedureSearch)
            .get(ENDPOINTS.legalProcedureTemplates.root)
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
        return this.httpService
            .get(ENDPOINTS.legalProcedureTemplates.byId(id))
            .pipe(
                map(procedure => ({
                    ...procedure,
                    legalTasks: procedure.legalTasks.map(task => ({title: task.title}))
                }))
            );
    }

    delete(id: string): Observable<void> {
        return this.httpService
            .successful()
            .delete(ENDPOINTS.legalProcedureTemplates.byId(id));
    }
}