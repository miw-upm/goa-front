import {Injectable} from '@angular/core';

import {environment} from "@env";
import {HttpService} from '@common/services/http.service';
import {Observable} from "rxjs";
import {LegalTask} from "../../features/home/legal-taks/models/legal-task.model";


@Injectable({providedIn: 'root'})
export class SharedLegalTaskService {
    private static readonly LEGAL_TASKS = environment.REST_ENCARGO + '/legal-tasks';

    constructor(private readonly httpService: HttpService) {
    }

    searchTasks(title: string): Observable<LegalTask[]> {
        return this.httpService
            .param("title", title ?? '')
            .get(SharedLegalTaskService.LEGAL_TASKS)
    }
}
