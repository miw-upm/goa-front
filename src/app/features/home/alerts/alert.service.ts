import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {AlertSummary} from './models/alert.model';

@Injectable()
export class AlertService {
    constructor(private readonly httpService: HttpService) {
    }

    findByEngagementLetterId(engagementLetterId: string): Observable<AlertSummary[]> {
        return this.httpService.request()
            .get<AlertSummary[]>(ENDPOINTS.alerts.byEngagementLetterId(engagementLetterId));
    }
}
