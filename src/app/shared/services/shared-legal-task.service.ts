import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {environment} from "@env";
import {HttpService} from '@common/services/http.service';
import {LegalTask} from "../models/legal-task.model";

@Injectable({providedIn: 'root'})
export class SharedLegalTaskService {
    private static readonly LEGAL_TASKS = environment.REST_ENGAGEMENT + '/legal-tasks';

    constructor(private readonly httpService: HttpService) {
    }

    searchTasks(title: string): Observable<LegalTask[]> {
        return this.httpService
            .param("title", title ?? '')
            .get(SharedLegalTaskService.LEGAL_TASKS)
    }

    create(task: LegalTask): Observable<LegalTask> {
        return this.httpService
            .post(SharedLegalTaskService.LEGAL_TASKS, task);
    }
}
