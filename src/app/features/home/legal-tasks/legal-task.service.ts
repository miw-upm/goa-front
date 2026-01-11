import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from "@env";
import {HttpService} from '@core/http/http.service';
import {LegalTask} from "../../common/models/legal-task.model";
import {LegalTaskSearch} from "./legal-task-search.model";

@Injectable({providedIn: 'root'})
export class LegalTaskService {
    private static readonly LEGAL_TASKS = environment.REST_ENGAGEMENT + '/legal-tasks';

    constructor(private readonly httpService: HttpService) {
    }

    update(id: string, task: LegalTask): Observable<LegalTask> {
        return this.httpService
            .successful()
            .put(LegalTaskService.LEGAL_TASKS + '/' + id, task);
    }

    search(legalTaskSearch: LegalTaskSearch): Observable<LegalTask[]> {
        return this.httpService
            .paramsFrom(legalTaskSearch)
            .get(LegalTaskService.LEGAL_TASKS)
    }


    delete(id: string) {
        return this.httpService
            .successful()
            .delete(LegalTaskService.LEGAL_TASKS + '/' + id);
    }

    read(id) {
        return this.httpService
            .get(LegalTaskService.LEGAL_TASKS + '/' + id);
    }
}
