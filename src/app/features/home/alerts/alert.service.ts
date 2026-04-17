import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {
    AlertCreate,
    AlertDetail,
    AlertNotificationConfig,
    AlertSummary,
    PendingAlertNotification
} from './models/alert.model';

@Injectable()
export class AlertService {
    constructor(private readonly httpService: HttpService) {
    }

    findByEngagementLetterId(engagementLetterId: string): Observable<AlertSummary[]> {
        return this.httpService.request()
            .get<AlertSummary[]>(ENDPOINTS.alerts.byEngagementLetterId(engagementLetterId));
    }

    findPendingNotifications(): Observable<PendingAlertNotification[]> {
        return this.httpService.request()
            .get<PendingAlertNotification[]>(ENDPOINTS.alertNotifications.pending());
    }

    read(alertId: string): Observable<AlertDetail> {
        return this.httpService.request()
            .get<AlertDetail>(ENDPOINTS.alerts.byId(alertId));
    }

    create(alert: AlertCreate): Observable<any> {
        return this.httpService.request()
            .success('Alerta creada correctamente')
            .post(ENDPOINTS.alerts.root, alert);
    }

    configureNotifications(alertId: string, payload: AlertNotificationConfig): Observable<any> {
        return this.httpService.request()
            .success('Notificaciones configuradas correctamente')
            .put(ENDPOINTS.alerts.notifications(alertId), payload);
    }
}
