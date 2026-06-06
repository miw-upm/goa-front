import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from "@core/api/endpoints";
import {LegalProcedureTemplate} from "../../home/engagement-letter/legal-procedure-templates/models/legal-procedure-template.model";

@Injectable({providedIn: 'root'})
export class SharedLegalProcedureService {
    constructor(private readonly httpService: HttpService) {
    }

    searchProcedures(title: string): Observable<LegalProcedureTemplate[]> {
        return this.httpService.request()
            .param('title', title ?? '')
            .get(ENDPOINTS.legalProcedureTemplates.root);
    }
}
