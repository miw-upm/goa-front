import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {
    AlertCreate,
    AlertDetail,
    AlertEdit,
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

    markNotificationAsShown(notificationId: string): Observable<any> {
        return this.httpService.request()
            .patch(ENDPOINTS.alertNotifications.shown(notificationId), {});
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

    cancel(alertId: string): Observable<any> {
        return this.httpService.request()
            .success('Alerta cancelada correctamente')
            .patch(ENDPOINTS.alerts.cancel(alertId), {});
    }

    updateAlert(alertId: string, alert: AlertEdit): Observable<any> {
        return this.httpService.request()
            .success('Alerta actualizada correctamente')
            .put(ENDPOINTS.alerts.byId(alertId), alert);
    }
}
