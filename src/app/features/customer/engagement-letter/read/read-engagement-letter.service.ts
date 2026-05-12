import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@shared/ui/api/http.service';

@Injectable({providedIn: 'root'})
export class ReadEngagementLetterService {

    constructor(private readonly httpService: HttpService) {
    }

    downloadDocument(scope: string, urlId: string, token: string): Observable<void> {
        return this.httpService.request()
            .openPdf(ENDPOINTS.engagementLetters.readDocument(scope, urlId, token));
    }
}
