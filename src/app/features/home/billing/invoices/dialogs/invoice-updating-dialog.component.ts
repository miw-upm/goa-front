import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';

import {AppDateFieldComponent} from "@shared/ui/inputs/forms/data.component";
import {FormFieldComponent} from "@shared/ui/inputs/forms/form-field.component";
import {FormTextareaComponent} from "@shared/ui/inputs/forms/form-textarea.component";
import {InvoiceService} from '../invoice.service';
import {Invoice} from '../models/invoice.model';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        AppDateFieldComponent,
        FormFieldComponent,
        FormTextareaComponent,
    ],
    templateUrl: 'invoice-updating-dialog.component.html'
})
export class InvoiceUpdatingDialogComponent {
    invoice: Invoice;
    private operationDateValue: Date | null = null;

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly dialogRef: MatDialogRef<InvoiceUpdatingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: Invoice
    ) {
        this.invoice = {
            ...data,
            billingInfo: {...data.billingInfo},
            originalInvoice: data.originalInvoice ? {...data.originalInvoice} : undefined,
            discounts: [...(data.discounts ?? [])],
        };
        this.operationDate = data.operationDate;
    }

    get operationDate(): Date | null {
        return this.operationDateValue;
    }

    set operationDate(value: Date | string | null | undefined) {
        const date = value instanceof Date ? value : this.parseDate(value);
        this.operationDateValue = date;
        this.invoice.operationDate = date ? this.formatDate(date) : undefined;
    }

    addDiscount(): void {
        this.invoice.discounts = [...(this.invoice.discounts ?? []), 0];
    }

    removeDiscount(index: number): void {
        this.invoice.discounts = this.invoice.discounts?.filter((_, position) => position !== index) ?? [];
    }

    update(): void {
        if (!this.invoice.id || !this.canUpdate()) {
            return;
        }
        this.invoiceService.update(this.invoice.id, this.buildInvoice())
            .subscribe(invoice => this.dialogRef.close(invoice.engagement?.reference));
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    canUpdate(): boolean {
        return this.validBillingInfo()
            && this.hasRequiredValues()
            && this.validRectification()
            && this.validDiscounts();
    }

    private buildInvoice(): Invoice {
        return {
            ...this.invoice,
            baseAmount: Number(this.invoice.baseAmount),
            baseExpense: this.optionalNumber(this.invoice.baseExpense),
            vatExpense: this.optionalNumber(this.invoice.vatExpense),
            concept: this.invoice.concept,
            discounts: this.invoice.discounts?.map(value => Number(value)) ?? []
        };
    }

    private hasRequiredValues(): boolean {
        return !!this.invoice.concept?.trim()
            && Number.isFinite(Number(this.invoice.baseAmount))
            && Number(this.invoice.baseAmount) > 0
            && this.validOptionalAmount(this.invoice.baseExpense)
            && this.validOptionalAmount(this.invoice.vatExpense);
    }

    private validBillingInfo(): boolean {
        return !!this.invoice.billingInfo?.fullName?.trim()
            && !!this.invoice.billingInfo?.identity?.trim()
            && !!this.invoice.billingInfo?.fullAddress?.trim();
    }

    private validRectification(): boolean {
        return !this.invoice.rectification || !!this.invoice.originalInvoice?.reason?.trim();
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
