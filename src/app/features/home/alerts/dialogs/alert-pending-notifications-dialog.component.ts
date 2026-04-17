import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

import {PendingAlertNotification} from '../models/alert.model';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule
    ],
    templateUrl: 'alert-pending-notifications-dialog.component.html',
    styleUrls: ['alert-dialog.component.css']
})
export class AlertPendingNotificationsDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) readonly notifications: PendingAlertNotification[]
    ) {
    }

    offsetLabel(offsetMinutes?: number): string {
        if (offsetMinutes === -4320) return '3 días antes';
        if (offsetMinutes === -1440) return '1 día antes';
        if (offsetMinutes === -120) return '2 horas antes';
        if (offsetMinutes === undefined || offsetMinutes === null) return '';

        const absoluteOffset = Math.abs(offsetMinutes);
        if (absoluteOffset >= 60) {
            const hours = absoluteOffset / 60;
            if (Number.isInteger(hours)) {
                return hours === 1 ? '1 hora antes' : `${hours} horas antes`;
            }
        }
        return absoluteOffset === 1 ? '1 minuto antes' : `${absoluteOffset} minutos antes`;
    }
}
