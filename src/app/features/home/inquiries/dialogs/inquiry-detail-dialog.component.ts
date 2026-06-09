import {Component, Inject, Optional} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CustomerInquiryService} from '../customer-inquiry.service';
import {CustomerInquiry} from '../models/customer-inquiry.model';
import {InquiryState} from '../models/inquiry-state.enum';

@Component({
    standalone: true,
    selector: 'app-inquiry-detail-dialog',
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: 'inquiry-detail-dialog.component.html'
})
export class InquiryDetailDialogComponent {
    inquiry: CustomerInquiry;
    isOpen: boolean;

    constructor(
        private readonly customerInquiryService: CustomerInquiryService,
        private readonly dialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) data: CustomerInquiry
    ) {
        this.inquiry = data ? {...data} : {subject: '', description: '', category: null};
        this.isOpen = this.inquiry.state === InquiryState.OPEN;
    }

    save(): void {
        if (!this.inquiry.id || !this.isOpen) return;
        this.customerInquiryService.update(this.inquiry.id, {
            subject: this.inquiry.subject,
            description: this.inquiry.description
        }).subscribe(() => this.dialog.closeAll());
    }

    delete(): void {
        if (!this.inquiry.id || !this.isOpen) return;
        this.customerInquiryService.delete(this.inquiry.id)
            .subscribe(() => this.dialog.closeAll());
    }
}