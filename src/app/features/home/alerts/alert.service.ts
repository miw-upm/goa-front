import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {AlertCreate, AlertSummary} from './models/alert.model';

@Injectable()
export class AlertService {
    constructor(private readonly httpService: HttpService) {
    }

    findByEngagementLetterId(engagementLetterId: string): Observable<AlertSummary[]> {
        return this.httpService.request()
            .get<AlertSummary[]>(ENDPOINTS.alerts.byEngagementLetterId(engagementLetterId));
    }

    create(alert: AlertCreate): Observable<any> {
        return this.httpService.request()
            .success('Alerta creada correctamente')
            .post(ENDPOINTS.alerts.root, alert);
    }
}
