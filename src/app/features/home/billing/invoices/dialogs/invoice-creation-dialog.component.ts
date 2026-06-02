import {Component} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';

import {InvoiceService} from '../invoice.service';
import {InvoiceCreation} from '../models/invoice-creation.model';
import {Invoice} from '../models/invoice.model';
import {SearchByCustomerComponent} from "@features/shared/ui/search-by-customer.component";
import {FormCustomerComponent} from "@shared/ui/inputs/forms/form-customer.component";
import {AppDateFieldComponent} from "@shared/ui/inputs/forms/data.component";
import {FormFieldComponent} from "@shared/ui/inputs/forms/form-field.component";
import {FormTextareaComponent} from "@shared/ui/inputs/forms/form-textarea.component";
import {User} from "@features/shared/models/user.model";

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIcon,
        SearchByCustomerComponent,
        FormCustomerComponent,
        AppDateFieldComponent,
        FormFieldComponent,
        FormTextareaComponent,
    ],
    templateUrl: 'invoice-creation-dialog.component.html'
})
export class InvoiceCreationDialogComponent {
    invoice: Invoice;
    selectedUser?: User;
    baseExpense?: string | number;
    vatExpense?: string | number;
    private operationDateValue: Date | null = null;

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly dialogRef: MatDialogRef<InvoiceCreationDialogComponent>
    ) {
        this.invoice = {
            billingInfo: {
                userId: undefined,
            },
            concept: '',
            baseAmount: undefined,
            discounts: [],
        };
    }

    setUser(user: User): void {
        this.selectedUser = user;
    }

    removeUser(): void {
        this.selectedUser = undefined;
    }

    get operationDate(): Date | null {
        return this.operationDateValue;
    }

    set operationDate(value: Date | string | null | undefined) {
        this.operationDateValue = value instanceof Date ? value : this.parseDate(value);
    }

    addDiscount(): void {
        this.invoice.discounts = [...(this.invoice.discounts ?? []), 0];
    }

    removeDiscount(index: number): void {
        this.invoice.discounts = this.invoice.discounts?.filter((_, position) => position !== index) ?? [];
    }

    create(): void {
        if (!this.canCreate()) {
            return;
        }
        this.invoiceService.create(this.buildCreation())
            .subscribe(() => this.dialogRef.close());
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    canCreate(): boolean {
        return !!this.selectedUser?.id && this.hasRequiredValues() && this.validDiscounts();
    }

    private buildCreation(): InvoiceCreation {
        return {
            userId: this.selectedUser!.id!,
            concept: this.invoice.concept,
            baseAmount: Number(this.invoice.baseAmount),
            baseExpense: this.optionalNumber(this.baseExpense),
            vatExpense: this.optionalNumber(this.vatExpense),
            operationDate: this.operationDate ? this.formatDate(this.operationDate) : undefined,
        };
    }

    private hasRequiredValues(): boolean {
        return !!this.invoice.concept?.trim()
            && Number.isFinite(Number(this.invoice.baseAmount))
            && Number(this.invoice.baseAmount) > 0
            && this.validOptionalAmount(this.baseExpense)
            && this.validOptionalAmount(this.vatExpense);
    }

    private validDiscounts(): boolean {
        return (this.invoice.discounts ?? []).every(value => Number.isFinite(Number(value)) && Number(value) >= 0);
    }

    private validOptionalAmount(value: string | number | undefined): boolean {
        return this.emptyValue(value) || (Number.isFinite(Number(value)) && Number(value) >= 0);
    }

    private optionalNumber(value: string | number | undefined): number | undefined {
        return this.emptyValue(value) ? undefined : Number(value);
    }

    private emptyValue(value: string | number | undefined): boolean {
        return value === undefined || value === '';
    }

    private parseDate(value: Date | string | null | undefined): Date | null {
        if (!value) {
            return null;
        }
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
