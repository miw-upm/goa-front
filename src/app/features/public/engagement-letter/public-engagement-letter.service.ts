import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {PublicEngagementLetter} from './models/public-engagement-letter.model';

@Injectable()
export class PublicEngagementLetterService {
    constructor(private readonly httpService: HttpService) {
    }

    readByToken(token: string): Observable<PublicEngagementLetter> {
        return this.httpService.request()
            .param('token', token)
            .get<PublicEngagementLetter>(ENDPOINTS.publicEngagementLetters.access());
    }
}
