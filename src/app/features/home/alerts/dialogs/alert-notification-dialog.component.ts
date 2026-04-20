import {Component, Inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';

import {AlertNotificationConfig} from '../models/alert.model';

interface AlertNotificationDialogData {
    alertId: string;
    selectedOffsets: number[];
}

@Component({
    standalone: true,
    imports: [
        MatDialogModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatCheckboxModule,
        MatButtonModule
    ],
    templateUrl: 'alert-notification-dialog.component.html'
})
export class AlertNotificationDialogComponent {
    readonly options = [
        {label: '3 días antes', value: -4320},
        {label: '1 día antes', value: -1440},
        {label: '2 horas antes', value: -120}
    ];

    selectedOffsets: number[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) readonly data: AlertNotificationDialogData,
        private readonly dialogRef: MatDialogRef<AlertNotificationDialogComponent>
    ) {
        this.selectedOffsets = data.selectedOffsets ?? [];
    }

    toggleOffset(offset: number, checked: boolean): void {
        if (checked) {
            if (!this.selectedOffsets.includes(offset)) {
                this.selectedOffsets = [...this.selectedOffsets, offset];
            }
            return;
        }

        this.selectedOffsets = this.selectedOffsets.filter(value => value !== offset);
    }

    save(): void {
        const payload: AlertNotificationConfig = {
            offsetMinutes: this.selectedOffsets
        };
        this.dialogRef.close(payload);
    }
}
