import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {IssueCreationRequest, IssueResponse} from './issue.model';
import {IssueSearch} from "./issue-search.model";

@Injectable({providedIn: 'root'})
export class IssueService {
    constructor(private readonly httpService: HttpService) {
    }

    read(issueId: string): Observable<IssueResponse> {
        return this.httpService.request()
            .error('No se pudo cargar la incidencia')
            .get(ENDPOINTS.issues.byId(issueId));
    }

    create(issue: IssueCreationRequest): Observable<IssueResponse> {
        return this.httpService.request()
            .success('Incidencia creada correctamente')
            .error('No se pudo crear la incidencia')
            .post(ENDPOINTS.issues.root, issue);
    }

    sync(issueId: string): Observable<IssueResponse> {
        return this.httpService.request()
            .success('Incidencia sincronizada correctamente')
            .error('No se pudo sincronizar la incidencia')
            .put(ENDPOINTS.issues.syncById(issueId));
    }

    search(criteria: IssueSearch): Observable<IssueResponse[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.issues.root);
    }
}
