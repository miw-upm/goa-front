import {Component, Inject, Optional} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormsModule, NgModel} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import {FormFieldComponent} from '@shared/ui/inputs/forms/field.component';
import {EngagementLetterService} from '../../engagement-letter/engagement-letter.service';
import {EngagementLetterCriteria} from '../../engagement-letter/models/engagement-letter-criteria.model';
import {ComplaintService} from '../complaint.service';
import {Complaint} from '../models/complaint.model';
import {Status} from '../models/status.enum';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        AsyncPipe,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        FormFieldComponent,
    ],
    providers: [EngagementLetterService],
    templateUrl: 'complaint-creation-dialog.component.html',
    styleUrls: ['complaint-creation-dialog.component.css']
})
export class ComplaintCreationDialogComponent {
    title: string;
    engagementIds: Observable<string[]>;
    complaint: Complaint = {
        id: undefined,
        engagementId: undefined,
        description: undefined,
        status: Status.OPEN,
        createdAt: undefined
    };

    constructor(
        private readonly complaintService: ComplaintService,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly dialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) data?: Complaint
    ) {
        this.title = data?.id ? 'Actualización de Queja' : 'Creación de Queja';

        const isEdit = !!data?.id;

        // Map data if present (for updates)
        this.complaint = {
            id: data?.id,
            engagementId: data?.engagementId,
            description: data?.description,
            status: data?.status ?? Status.OPEN,
            createdAt: isEdit ? data?.createdAt : this.getCurrentFormattedDate()
        };

        const criteria: EngagementLetterCriteria = {
            opened: true,
            client: '',
            legalProcedureTitle: ''
        };
        this.engagementIds = this.engagementLetterService.search(criteria)
            .pipe(map(engagements => engagements
                .map(engagement => engagement.id)
                .filter((id): id is string => !!id)));
    }

    private getCurrentFormattedDate(): string {
        const now = new Date();
        return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    }

    create(): void {
        if (!this.isCreate() || !this.canSubmit()) {
            return;
        }
        this.complaintService
            .create(this.complaint)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        // Ensure we are in edit mode, have an ID, and data is valid
        if (this.isCreate() || !this.complaint.id || !this.canSubmit()) {
            return;
        }

        // Send the update to your service
        this.complaintService
            .update(this.complaint.id, this.complaint)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return !this.complaint.id;
    }

    canSubmit(): boolean {
        return !!this.complaint.engagementId
            && !!this.complaint.description?.trim()
            && !!this.complaint.status
            && !!this.complaint.createdAt;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }
}