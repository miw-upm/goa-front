import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from "@env";
import {HttpService} from '@common/services/http.service';
import {LegalTask} from "./legal-task.model";
import {LegalTaskSearch} from "./pages/legal-task-search.model";

@Injectable({providedIn: 'root'})
export class LegalTaskService {
    private static readonly LEGAL_TASKS = environment.REST_ENCARGO + '/legal-tasks';

    constructor(private readonly httpService: HttpService) {
    }

    create(task: LegalTask): Observable<LegalTask> {
        return this.httpService
            .post(LegalTaskService.LEGAL_TASKS, task);
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
