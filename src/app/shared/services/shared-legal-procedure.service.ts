import {Injectable} from '@angular/core';

import {environment} from "@env";
import {HttpService} from '@common/services/http.service';
import {Observable} from "rxjs";
import {LegalProcedure} from "../../features/home/engagement-letter/legal-procedure.model";
import {LegalProcedureTemplate} from "../../features/home/procedimientos-legales/legal-procedure-template.model";

@Injectable({providedIn: 'root'})
export class SharedLegalProcedureService {
    private static readonly API_URL = environment.REST_ENCARGO + '/legal-procedure-templates';

    constructor(private readonly httpService: HttpService) {
    }

    searchProcedures(title: string): Observable<LegalProcedureTemplate[]> {
        return this.httpService
            .param("title", title ?? '')
            .get(SharedLegalProcedureService.API_URL)
    }
}
