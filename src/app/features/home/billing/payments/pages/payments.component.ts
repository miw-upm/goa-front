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
import {WarningDialogComponent} from "@shared/ui/dialogs/warning-dialog.component";
import {AuthService} from "@core/auth/auth.service";


@Component({
    standalone: true,
    imports: [FilterDateComponent, FilterInputComponent, TitleComponent, CrudComponent, MatButtonToggle, MatButtonToggleGroup, FormsModule],
    templateUrl: 'payments.component.html'
})
export class PaymentsComponent {
    deleteVisibility = false;
    payments = of([] as Payment[]);
    payment: Observable<Payment>;
    criteria: PaymentFindCriteria = {invoiced: null};
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
        this.payments = this.paymentService.search(this.criteria);
    }

    resetSearch(): void {
        this.criteria = {};
    }

    create(): void {
        this.dialog
            .open(PaymentCreationUpdatingDialogComponent, {width: '600px'})
            .afterClosed()
            .subscribe((reference?: string) => this.setEngagementReferenceAndSearch(reference));
    }

    update(payment: Payment): void {
        this.dialog
            .open(PaymentCreationUpdatingDialogComponent, {width: '600px', data: payment})
            .afterClosed()
            .subscribe((reference?: string) => this.setEngagementReferenceAndSearch(reference));
    }

    delete(payment: Payment): void {
        if (payment.invoiced) {
            this.dialog.open(WarningDialogComponent, {
                data: {title: 'Warning', message: 'Este ingreso ya ha sido facturado. No se puede eliminar.'}
            });
        } else {
            this.paymentService.delete(payment.id).subscribe(() => this.search());
        }
    }

    read(payment: Payment): void {
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

    private setEngagementReferenceAndSearch(reference: string | undefined): void {
        this.criteria.client = undefined;
        this.criteria.engagementReference = reference;
        this.search();
    }
}
