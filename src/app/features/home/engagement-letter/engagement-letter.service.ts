import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpService} from "@core/http/http.service";
import {EngagementLetter} from "./models/engagement-letter.model";
import {LegalProcedureTemplate} from "../../common/models/legal-procedure-template.model";
import {EngagementLetterSearch} from "./models/engagement-letter-search.model";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable()
export class EngagementLetterService {
    constructor(private readonly httpService: HttpService) {
    }

    create(engagement: EngagementLetter): Observable<LegalProcedureTemplate> {
        return this.httpService.request()
            .post(ENDPOINTS.engagementLetters.root, engagement);
    }

    update(id: string, engagement: EngagementLetter): Observable<LegalProcedureTemplate> {
        return this.httpService.request()
            .successful()
            .put(ENDPOINTS.engagementLetters.byId(id), engagement);
    }

    search(criteria: EngagementLetterSearch): Observable<EngagementLetter[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.engagementLetters.root);
    }

    read(id: string): Observable<EngagementLetter> {
        return this.httpService.request()
            .get(ENDPOINTS.engagementLetters.byId(id));
    }

    delete(id: string) {
        return this.httpService.request()
            .successful()
            .delete(ENDPOINTS.engagementLetters.byId(id));
    }
}