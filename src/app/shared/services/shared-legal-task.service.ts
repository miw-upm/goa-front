import {Injectable} from '@angular/core';

import {environment} from "@env";
import {HttpService} from '@common/services/http.service';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class SharedLegalTaskService {
    private static readonly LEGAL_TASKS = environment.REST_ENCARGO + '/legal-tasks';

    constructor(private readonly httpService: HttpService) {
    }

    searchTasks(title: string): Observable<string[]> {
        return this.httpService
            .param("title", title ?? '')
            .get(SharedLegalTaskService.LEGAL_TASKS)
            .pipe(
                map(tasks =>
                    tasks.map((task => `${task.title}`))
                )
            )
    }
}
