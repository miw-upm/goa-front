import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpService} from '@core/http/http.service';
import {LegalTask} from "../models/legal-task.model";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable({providedIn: 'root'})
export class SharedLegalTaskService {
    constructor(private readonly httpService: HttpService) {
    }

    searchTasks(title: string): Observable<LegalTask[]> {
        return this.httpService.request()
            .param('title', title ?? '')
            .get(ENDPOINTS.legalTasks.root);
    }

    create(task: LegalTask): Observable<LegalTask> {
        return this.httpService.request()
            .post(ENDPOINTS.legalTasks.root, task);
    }
}
