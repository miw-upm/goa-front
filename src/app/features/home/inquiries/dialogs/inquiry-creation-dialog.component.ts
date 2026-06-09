import {Component} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {CustomerInquiryService} from '../customer-inquiry.service';
import {CustomerInquiry} from '../models/customer-inquiry.model';
import {InquiryCategory} from '../models/inquiry-category.enum';
import {MatDialog} from '@angular/material/dialog';

@Component({
    standalone: true,
    selector: 'app-inquiry-creation-dialog',
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    templateUrl: 'inquiry-creation-dialog.component.html'
})
export class InquiryCreationDialogComponent {
    categories = Object.values(InquiryCategory);
    inquiry: CustomerInquiry = {
        subject: '',
        description: '',
        category: InquiryCategory.OTHER
    };

    constructor(
        private readonly customerInquiryService: CustomerInquiryService,
        private readonly dialog: MatDialog
    ) {
    }

    create(): void {
        if (!this.canSubmit()) return;
        this.customerInquiryService.create(this.inquiry)
            .subscribe(() => this.dialog.closeAll());
    }

    canSubmit(): boolean {
        return !!this.inquiry.subject?.trim()
            && !!this.inquiry.description?.trim()
            && !!this.inquiry.category;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(c => c.invalid && (c.dirty || c.touched));
    }
}