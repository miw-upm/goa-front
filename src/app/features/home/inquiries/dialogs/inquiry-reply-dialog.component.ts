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
    selector: 'app-inquiry-reply-dialog',
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
    templateUrl: 'inquiry-reply-dialog.component.html'
})
export class InquiryReplyDialogComponent {
    inquiry: CustomerInquiry;
    replyText = '';
    isOpen: boolean;
    isAnswered: boolean;

    constructor(
        private readonly customerInquiryService: CustomerInquiryService,
        private readonly dialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) data: CustomerInquiry
    ) {
        this.inquiry = data ? {...data} : {} as CustomerInquiry;
        this.isOpen = this.inquiry.state === InquiryState.OPEN;
        this.isAnswered = this.inquiry.state === InquiryState.ANSWERED;
        this.replyText = this.inquiry.reply ?? '';
    }

    reply(): void {
        if (!this.inquiry.id || !this.isOpen || !this.replyText.trim()) return;
        this.customerInquiryService.reply(this.inquiry.id, this.replyText)
            .subscribe(() => this.dialog.closeAll());
    }

    close(): void {
        if (!this.inquiry.id || !this.isAnswered) return;
        this.customerInquiryService.close(this.inquiry.id)
            .subscribe(() => this.dialog.closeAll());
    }
}