import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from "@core/api/endpoints";
import {LegalTask} from "@features/shared/models/legal-task.model";
import {LegalTaskSearch} from "./legal-task-search.model";

@Injectable({providedIn: 'root'})
export class LegalTaskService {
    constructor(private readonly httpService: HttpService) {
    }

    update(id: string, task: LegalTask): Observable<LegalTask> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.legalTasks.byId(id), task);
    }

    search(legalTaskSearch: LegalTaskSearch): Observable<LegalTask[]> {
        return this.httpService.request()
            .paramsFrom(legalTaskSearch)
            .get(ENDPOINTS.legalTasks.root);
    }

    read(id: string): Observable<LegalTask> {
        return this.httpService.request()
            .get(ENDPOINTS.legalTasks.byId(id));
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.legalTasks.byId(id));
    }
}
