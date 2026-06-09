import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {CustomerInquiry} from '../models/customer-inquiry.model';
import {CustomerInquiryService} from '../customer-inquiry.service';
import {InquiryCreationDialogComponent} from '../dialogs/inquiry-creation-dialog.component';
import {InquiryDetailDialogComponent} from '../dialogs/inquiry-detail-dialog.component';

@Component({
    standalone: true,
    selector: 'app-customer-inquiries',
    imports: [CrudComponent],
    templateUrl: 'customer-inquiries.component.html'
})
export class CustomerInquiriesComponent {
    title = 'Mis Consultas';
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

    create(): void {
        this.dialog.open(InquiryCreationDialogComponent, {width: '600px'})
            .afterClosed()
            .subscribe(() => this.search());
    }

    read(inquiry: CustomerInquiry): void {
        this.inquiry = this.customerInquiryService.readById(inquiry.id);
        this.dialog.open(InquiryDetailDialogComponent, {
            width: '600px',
            data: inquiry
        }).afterClosed().subscribe(() => this.search());
    }
}