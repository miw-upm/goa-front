import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@env';
import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {LegalProcedureTemplate} from '@features/shared/models/legal-procedure-template.model';
import {EngagementLetter} from './models/engagement-letter.model';
import {EngagementLetterSearch} from './models/engagement-letter-search.model';
import {PublicAccessToken} from './models/public-access-token.model';

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
            .success()
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

    print(id: string):Observable<void> {
        return this.httpService
            .request()
            .openPdf(ENDPOINTS.engagementLetters.print(id));
    }

    delete(id: string) {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.engagementLetters.byId(id));
    }

    createPublicAccessToken(id: string): Observable<PublicAccessToken> {
        return this.httpService.request()
            .post<PublicAccessToken>(ENDPOINTS.engagementLetters.publicAccessToken(id), {})
            .pipe(
                map(publicAccessToken => ({
                    ...publicAccessToken,
                    publicUrl: this.createPublicLink(publicAccessToken.publicUrl)
                }))
            );
    }

    private createPublicLink(publicUrl: string): string {
        if (!publicUrl) {
            return '';
        }
        if (publicUrl.startsWith('http://') || publicUrl.startsWith('https://')) {
            return publicUrl;
        }
        const normalizedPath = publicUrl.startsWith('/') ? publicUrl : `/${publicUrl}`;
        return `${environment.FRONT_END}${normalizedPath}`;
    }

}
