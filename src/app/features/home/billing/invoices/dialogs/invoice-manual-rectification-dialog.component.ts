import {Component} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

import {SearchByCustomerComponent} from '@features/shared/ui/search-by-customer.component';
import {User} from '@features/shared/models/user.model';
import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {FormCustomerComponent} from '@shared/ui/inputs/forms/form-customer.component';
import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {FormTextareaComponent} from '@shared/ui/inputs/forms/form-textarea.component';
import {InvoiceService} from '../invoice.service';
import {InvoiceCreationManualRectification} from '../models/invoice-creation-manual-rectification.model';
import {OriginalInvoice} from '../models/invoice.model';

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
        AppDateFieldComponent,
        FormCustomerComponent,
        FormFieldComponent,
        FormTextareaComponent,
    ],
    templateUrl: 'invoice-manual-rectification-dialog.component.html'
})
export class InvoiceManualRectificationDialogComponent {
    originalInvoice: OriginalInvoice = {};
    selectedUser?: User;
    concept = '';
    percentage: number | string | undefined = 100;
    baseAmount: number | string | undefined;
    vatAmount: number | string | undefined;
    vatRate: number | string | undefined = 21;
    baseExpense: number | string | undefined;
    vatExpense: number | string | undefined;
    private originalEmissionDateValue: Date | null = null;
    private operationDateValue: Date | null = null;

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly dialogRef: MatDialogRef<InvoiceManualRectificationDialogComponent>
    ) {
    }

    get originalEmissionDate(): Date | null {
        return this.originalEmissionDateValue;
    }

    set originalEmissionDate(value: Date | string | null | undefined) {
        this.originalEmissionDateValue = value instanceof Date ? value : this.parseDate(value);
        this.originalInvoice.emissionDate = this.originalEmissionDateValue
            ? this.formatDate(this.originalEmissionDateValue)
            : undefined;
    }

    get operationDate(): Date | null {
        return this.operationDateValue;
    }

    set operationDate(value: Date | string | null | undefined) {
        this.operationDateValue = value instanceof Date ? value : this.parseDate(value);
    }

    setUser(user: User): void {
        this.selectedUser = user;
    }

    removeUser(): void {
        this.selectedUser = undefined;
    }

    create(): void {
        if (!this.canCreate()) {
            return;
        }

        this.invoiceService.createManualRectification(this.buildCreation())
            .subscribe(invoice => this.dialogRef.close(invoice));
    }

    canCreate(): boolean {
        return this.validOriginalInvoice()
            && !!this.selectedUser?.id
            && !!this.concept.trim()
            && this.validRequiredAmount(this.baseAmount)
            && this.validRequiredAmount(this.vatAmount)
            && this.validRequiredAmount(this.vatRate)
            && this.validOptionalAmount(this.percentage)
            && this.validOptionalAmount(this.baseExpense)
            && this.validOptionalAmount(this.vatExpense);
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    private buildCreation(): InvoiceCreationManualRectification {
        return {
            originalInvoice: {
                ...this.originalInvoice,
                number: this.optionalNumber(this.originalInvoice.number)
            },
            concept: this.concept,
            userId: this.selectedUser!.id!,
            percentage: this.optionalNumber(this.percentage),
            operationDate: this.operationDate ? this.formatDate(this.operationDate) : undefined,
            baseAmount: Number(this.baseAmount),
            vatAmount: Number(this.vatAmount),
            vatRate: Number(this.vatRate),
            baseExpense: this.optionalNumber(this.baseExpense),
            vatExpense: this.optionalNumber(this.vatExpense)
        };
    }

    private validOriginalInvoice(): boolean {
        return !!this.originalInvoice.series?.trim()
            && Number.isInteger(Number(this.originalInvoice.number))
            && Number(this.originalInvoice.number) >= 1
            && !!this.originalInvoice.reason?.trim();
    }

    private validRequiredAmount(value: string | number | undefined): boolean {
        return Number.isFinite(Number(value));
    }

    private validOptionalAmount(value: string | number | undefined): boolean {
        return this.emptyValue(value) || Number.isFinite(Number(value));
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
