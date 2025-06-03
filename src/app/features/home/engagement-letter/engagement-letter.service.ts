import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpService} from "@common/services/http.service";
import {environment} from "@env";
import {EngagementLetter} from "./engagement-letter.model";
import {LegalProcedureTemplate} from "../procedimientos-legales/legal-procedure-template.model";

@Injectable({providedIn: 'root'})
export class EngagementLetterService {
    private static readonly API_URL = environment.REST_ENCARGO + '/engagement-letters';

    constructor(private readonly httpService: HttpService) {
    }

    create(engagement: EngagementLetter): Observable<LegalProcedureTemplate> {
        return this.httpService
            .post(EngagementLetterService.API_URL, engagement);
    }

    update(id: string, engagement: EngagementLetter): Observable<LegalProcedureTemplate> {
        return this.httpService
            .successful()
            .put(EngagementLetterService.API_URL + `/${id}`, engagement);
    }

}
