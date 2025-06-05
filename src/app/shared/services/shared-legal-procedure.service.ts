import {Injectable} from '@angular/core';

import {environment} from "@env";
import {HttpService} from '@common/services/http.service';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class SharedLegalProcedureService {
    private static readonly API_URL = environment.REST_ENCARGO + '/legal-procedure-templates';

    constructor(private readonly httpService: HttpService) {
    }

    searchProcedures(title: string): Observable<string[]> {
        return this.httpService
            .param("title", title ?? '')
            .get(SharedLegalProcedureService.API_URL)
            .pipe(
                map(procedures =>
                    procedures.map((procedure => `${procedure.title}`))
                )
            )
    }
}
