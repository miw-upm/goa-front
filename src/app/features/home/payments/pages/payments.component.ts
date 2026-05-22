import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {catchError, map, Observable, of} from 'rxjs';

import {AuthService} from '@core/auth/auth.service';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterDateComponent} from '@shared/ui/inputs/filters/filter-date.component';
import {FilterInputComponent} from '@shared/ui/inputs/filters/filter-input.component';
import {TitleComponent} from '@shared/ui/title/title.component';
import {PaymentCreationUpdatingDialogComponent} from '../dialogs/payment-creation-updating-dialog.component';
import {PaymentFindCriteria} from '../models/payment-find-criteria.model';
import {Payment} from '../models/payment.model';
import {PaymentService} from '../payment.service';
import {PAYMENTS_COLUMNS} from './payments-columns.config';

@Component({
    standalone: true,
    imports: [FilterDateComponent, FilterInputComponent, TitleComponent, CrudComponent],
    templateUrl: 'payments.component.html'
})
export class PaymentsComponent {
    deleteVisibility = false;
    payments = of([] as Payment[]);
    payment: Observable<Payment>;
    criteria: PaymentFindCriteria = {};
    columns = PAYMENTS_COLUMNS;

    constructor(
        private readonly dialog: MatDialog,
        private readonly paymentService: PaymentService,
        auth: AuthService
    ) {
        this.deleteVisibility = auth.isAdmin();
    }

    search(): void {
        this.criteria.fromDate = this.formatDateValue(this.criteria.fromDate);
        this.payments = this.paymentService.search(this.criteria)
            .pipe(
                map(payments => [...payments].sort((a, b) => b.date.localeCompare(a.date))),
                catchError(() => of([] as Payment[]))
            );
    }

    resetSearch(): void {
        this.criteria = {};
    }

    create(): void {
        this.dialog
            .open(PaymentCreationUpdatingDialogComponent, {width: '600px'})
            .afterClosed()
            .subscribe(() => this.search());
    }

    update(payment: Payment): void {
        this.dialog
            .open(PaymentCreationUpdatingDialogComponent, {width: '600px', data: payment})
            .afterClosed()
            .subscribe(() => this.search());
    }

    delete(payment: Payment): void {
        if (!payment.id) {
            return;
        }
        this.paymentService.delete(payment.id).subscribe(() => this.search());
    }

    read(payment: Payment): void {
        if (!payment.id) {
            return;
        }
        this.payment = this.paymentService.read(payment.id);
    }

    private formatDateValue(value: Date | string | undefined): string | undefined {
        if (!value) {
            return undefined;
        }
        if (typeof value === 'string') {
            return value;
        }
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
