import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from '@env';
import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {EngagementLetter} from './models/engagement-letter.model';
import {EngagementLetterFindCriteria} from './models/engagement-letter-find-criteria.model';
import {User} from "@features/shared/models/user.model";
import {SharedAccessLinkService} from "@features/shared/services/shared-access-link.service";

@Injectable()
export class EngagementLetterService {
    private readonly ACCEPT_ENGAGEMENT_LETTER_SCOPE = 'accept-engagement-letter';

    constructor(private readonly httpService: HttpService,
                private readonly sharedAccessLinkService: SharedAccessLinkService) {
    }

    create(engagement: EngagementLetter): Observable<EngagementLetter> {
        return this.httpService.request()
            .post(ENDPOINTS.engagementLetters.root, engagement);
    }

    update(id: string, engagement: EngagementLetter): Observable<void> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.engagementLetters.byId(id), engagement);
    }

    search(criteria: EngagementLetterFindCriteria): Observable<EngagementLetter[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.engagementLetters.root);
    }

    read(id: string): Observable<EngagementLetter> {
        return this.httpService.request()
            .get(ENDPOINTS.engagementLetters.byId(id));
    }

    print(id: string): Observable<void> {
        return this.httpService
            .request()
            .openPdf(ENDPOINTS.engagementLetters.print(id));
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.engagementLetters.byId(id));
    }

    createAccessLink(engagement: EngagementLetter, user: User): Observable<string> {
        return this.sharedAccessLinkService.createAccessLink({
            mobile: user.mobile,
            scope: this.ACCEPT_ENGAGEMENT_LETTER_SCOPE,
            document: engagement.id
        });
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