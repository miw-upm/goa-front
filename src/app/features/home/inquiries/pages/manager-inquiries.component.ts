import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {CustomerInquiry} from '../models/customer-inquiry.model';
import {CustomerInquiryService} from '../customer-inquiry.service';
import {InquiryReplyDialogComponent} from '../dialogs/inquiry-reply-dialog.component';

@Component({
    standalone: true,
    selector: 'app-manager-inquiries',
    imports: [CrudComponent],
    templateUrl: 'manager-inquiries.component.html'
})
export class ManagerInquiriesComponent {
    title = 'Consultas de clientes';
    inquiries = of([] as CustomerInquiry[]);
    inquiry: Observable<CustomerInquiry>;

    constructor(
        private readonly dialog: MatDialog,
        private readonly customerInquiryService: CustomerInquiryService
    ) {
    }

    search(): void {
        this.inquiries = this.customerInquiryService.findAll();
    }

    read(inquiry: CustomerInquiry): void {
        this.inquiry = this.customerInquiryService.readById(inquiry.id);
        this.dialog.open(InquiryReplyDialogComponent, {
            width: '600px',
            data: inquiry
        }).afterClosed().subscribe(() => this.search());
    }
}