import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AlertService} from '../../alert.service';
import {AlertDetail, AlertEdit} from '../../models/alert.model';
import {CommonModule, DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';

interface EditAlertData {
    alertId: string;
}

@Component({
    selector: 'app-alert-detail-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        FormFieldComponent,
        AppDateFieldComponent
    ],
    providers: [DatePipe, AlertService],
    templateUrl: './alert-edit-dialog.component.html',
    styleUrls: ['./alert-edit-dialog.component.css'],
})
export class AlertEditDialogComponent {
    alert: AlertDetail;

    constructor(
        private readonly alertService: AlertService,
        private readonly dialogRef: MatDialogRef<AlertEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EditAlertData,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit(): void {
        this.alertService.read(this.data.alertId).subscribe((alertDetail) => {
            this.alert = alertDetail;
        });
    }

    save(): void {
        const payload: AlertEdit = {
            title: this.alert.title,
            description: this.alert.description,
            dueDate: this.datePipe.transform(this.alert.dueDate, 'yyyy-MM-ddTHH:mm:ss'),
        };
        this.alertService.updateAlert(this.alert.id, payload).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    closeDialog(): void {
        this.dialogRef.close(false);
    }
}