import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';

import {FormFieldComponent} from '@shared/ui/inputs/forms/field.component';
import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {AlertService} from '../alert.service';
import {AlertCreate} from '../models/alert.model';

interface AlertCreationData {
    engagementLetterId: string;
}

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatNativeDateModule,
        FormFieldComponent,
        AppDateFieldComponent
    ],
    providers: [DatePipe, AlertService],
    templateUrl: 'alert-creation-dialog.component.html',
    styleUrls: ['alert-dialog.component.css']
})
export class AlertCreationDialogComponent {
    alert = {
        title: '',
        description: '',
        dueDate: null
    };

    private readonly engagementLetterId: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: AlertCreationData,
        private readonly alertService: AlertService,
        private readonly dialog: MatDialog,
        private readonly datePipe: DatePipe
    ) {
        this.engagementLetterId = data.engagementLetterId;
    }

    invalid(): boolean {
        return !this.alert.title?.trim() || !this.alert.dueDate;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    create(): void {
        const payload: AlertCreate = {
            title: this.alert.title,
            description: this.alert.description,
            dueDate: this.datePipe.transform(this.alert.dueDate, "yyyy-MM-dd'T'HH:mm:ss"),
            engagementLetterId: this.engagementLetterId
        };
        this.alertService.create(payload).subscribe(() => this.dialog.closeAll());
    }
}
