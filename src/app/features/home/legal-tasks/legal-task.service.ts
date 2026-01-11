import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '@core/http/http.service';
import {LegalTask} from "../../common/models/legal-task.model";
import {LegalTaskSearch} from "./legal-task-search.model";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable({providedIn: 'root'})
export class LegalTaskService {
    constructor(private readonly httpService: HttpService) {
    }

    update(id: string, task: LegalTask): Observable<LegalTask> {
        return this.httpService
            .successful()
            .put(ENDPOINTS.legalTasks.byId(id), task);
    }

    search(legalTaskSearch: LegalTaskSearch): Observable<LegalTask[]> {
        return this.httpService
            .paramsFrom(legalTaskSearch)
            .get(ENDPOINTS.legalTasks.root);
    }

    read(id: string): Observable<LegalTask> {
        return this.httpService
            .get(ENDPOINTS.legalTasks.byId(id));
    }

    delete(id: string): Observable<void> {
        return this.httpService
            .successful()
            .delete(ENDPOINTS.legalTasks.byId(id));
    }
}
