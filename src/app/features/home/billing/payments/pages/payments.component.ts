import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {PaymentCreationUpdatingDialogComponent} from '../dialogs/payment-creation-updating-dialog.component';
import {PaymentFindCriteria} from '../models/payment-find-criteria.model';
import {Payment} from '../models/payment.model';
import {PaymentService} from '../payment.service';
import {PAYMENTS_COLUMNS} from './payments-columns.config';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {FilterDateComponent} from "@shared/ui/inputs/filters/filter-date.component";
import {FilterInputComponent} from "@shared/ui/inputs/filters/filter-input.component";
import {TitleComponent} from "@shared/ui/title/title.component";
import {CrudComponent} from "@shared/ui/crud/crud.component";
import {AuthService} from "@core/auth/auth.service";
import {BillingPeriodService} from "../../shared/billing-period.service";


@Component({
    standalone: true,
    imports: [FilterDateComponent, FilterInputComponent, TitleComponent, CrudComponent, MatButtonToggle, MatButtonToggleGroup, FormsModule],
    templateUrl: 'payments.component.html'
})
export class PaymentsComponent {
    deleteVisibility = false;
    payments = of([] as Payment[]);
    payment: Observable<Payment>;
    criteria: PaymentFindCriteria;
    columns = PAYMENTS_COLUMNS;

    constructor(
        private readonly dialog: MatDialog,
        private readonly paymentService: PaymentService,
        private readonly billingPeriodService: BillingPeriodService,
        auth: AuthService
    ) {
        this.deleteVisibility = auth.isAdmin();
        this.criteria = this.initialCriteria();
    }

    search(): void {
        this.payments = this.paymentService.search({
            ...this.criteria,
            fromDate: this.billingPeriodService.formatDateValue(this.criteria.fromDate)
        });
    }

    resetSearch(): void {
        this.criteria = this.initialCriteria();
    }

    create(): void {
        this.dialog
            .open(PaymentCreationUpdatingDialogComponent, {width: '600px'})
            .afterClosed()
            .subscribe((id?: string) => this.setEngagementIdAndSearch(id));
    }

    update(payment: Payment): void {
        this.dialog
            .open(PaymentCreationUpdatingDialogComponent, {width: '600px', data: payment})
            .afterClosed()
            .subscribe((id?: string) => this.setEngagementIdAndSearch(id));
    }

    delete(payment: Payment): void {
        this.paymentService.delete(payment.id).subscribe(() => this.search());
    }

    read(payment: Payment): void {
        this.payment = this.paymentService.read(payment.id);
    }

    private setEngagementIdAndSearch(id: string | undefined): void {
        this.criteria.client = undefined;
        this.criteria.engagementId = id?.substring(0, 4);
        this.search();
    }

    private initialCriteria(): PaymentFindCriteria {
        return {
            invoiced: null,
            fromDate: this.billingPeriodService.currentQuarterStartDate()
        };
    }
}
