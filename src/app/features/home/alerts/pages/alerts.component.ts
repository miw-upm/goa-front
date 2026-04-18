import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {AlertService} from '../alert.service';
import {AlertCreationDialogComponent} from '../dialogs/alert-creation-dialog.component';
import {AlertNotificationDialogComponent} from '../dialogs/alert-notification-dialog.component';
import { AlertDetailDialogComponent } from '../dialogs/alert-detail-dialog/alert-detail-dialog.component';

@Component({
    standalone: true,
    providers: [AlertService, DatePipe],
    imports: [CrudComponent, MatButtonModule, MatIconModule],
    templateUrl: 'alerts.component.html'
})
export class AlertsComponent {
    title = 'Alertas de Hoja de Encargo';
    engagementLetterId: string;
    alerts$: Observable<any[]> = of([]);

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly alertService: AlertService,
        private readonly datePipe: DatePipe
    ) {
        this.engagementLetterId = this.route.snapshot.paramMap.get('id');
        this.search();
    }

    search(): void {
        this.alerts$ = this.alertService.findByEngagementLetterId(this.engagementLetterId).pipe(
            map(alerts => alerts.map(alert => ({
                ...alert,
                dueDate: alert.dueDate
                    ? this.datePipe.transform(alert.dueDate, 'dd/MM/yyyy')
                    : null
            })))
        );
    }

    goBack(): void {
        void this.router.navigate(['/home/engagement-letters']);
    }

    openCreateDialog(): void {
        this.dialog.open(AlertCreationDialogComponent, {
            data: {
                engagementLetterId: this.engagementLetterId
            },
            width: '600px'
        }).afterClosed().subscribe(() => this.search());
    }

    openNotificationDialog(alert: any): void {
        this.alertService.read(alert.id).subscribe(alertDetail => {
            this.dialog.open(AlertNotificationDialogComponent, {
                data: {
                    alertId: alert.id,
                    selectedOffsets: (alertDetail.notifications ?? [])
                        .map(notification => notification.offsetMinutes)
                        .filter((offset): offset is number => offset !== undefined && offset !== null)
                },
                width: '600px'
            }).afterClosed().subscribe(result => {
                if (!result) {
                    return;
                }

                this.alertService.configureNotifications(alert.id, result)
                    .subscribe(() => this.search());
            });
        });
    }

    cancelAlert(alert: any): void {
        this.alertService.cancel(alert.id).subscribe(() => {
            this.search();
        });
    }

    openAlertDetailDialog(alertId: string): void {
        this.dialog.open(AlertDetailDialogComponent, {
            data: { alertId },
            width: '600px'
        });
    }
}
