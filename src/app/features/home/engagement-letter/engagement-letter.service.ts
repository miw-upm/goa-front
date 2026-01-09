import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpService} from "@core/http/http.service";
import {environment} from "@env";
import {EngagementLetter} from "./models/engagement-letter.model";
import {LegalProcedureTemplate} from "@shared/models/legal-procedure-template.model";
import {EngagementLetterSearch} from "./models/engagement-letter-search.model";

@Injectable()
export class EngagementLetterService {
    private static readonly API_URL = environment.REST_ENGAGEMENT + '/engagement-letters';

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

    search(criteria: EngagementLetterSearch): Observable<EngagementLetter[]> {
        return this.httpService
            .paramsFrom(criteria)
            .get(EngagementLetterService.API_URL)
    }

    read(id: string): Observable<EngagementLetter> {
        return this.httpService
            .get(EngagementLetterService.API_URL + `/${id}`);
    }

    delete(id: string) {
        return this.httpService
            .successful()
            .delete(EngagementLetterService.API_URL + `/${id}`);
    }
}
