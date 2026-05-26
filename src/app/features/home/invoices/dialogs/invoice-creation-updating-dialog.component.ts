import {Component, Inject, Optional} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';

import {User} from '@features/shared/models/user.model';
import {SearchByCustomerComponent} from '@features/shared/ui/search-by-customer.component';
import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {FormCustomerComponent} from '@shared/ui/inputs/forms/form-customer.component';
import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {InvoiceService} from '../invoice.service';
import {InvoiceCreation} from '../models/invoice-creation.model';
import {Invoice} from '../models/invoice.model';
import {FormTextareaComponent} from "@shared/ui/inputs/forms/form-textarea.component";

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIconButton,
        MatIcon,
        MatFormField,
        MatLabel,
        MatInput,
        SearchByCustomerComponent,
        FormCustomerComponent,
        AppDateFieldComponent,
        FormFieldComponent,
        FormTextareaComponent,
    ],
    templateUrl: 'invoice-creation-updating-dialog.component.html'
})
export class InvoiceCreationUpdatingDialogComponent {
    title: string;
    invoice: Invoice;
    selectedUser?: User;
    private operationDateValue: Date | null = null;

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly dialogRef: MatDialogRef<InvoiceCreationUpdatingDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) data?: Invoice
    ) {
        this.title = data?.id ? 'Edicion de Factura' : 'Creacion manual de Factura';
        this.invoice = data ? {
            ...data,
            billingInfo: {...data.billingInfo},
            discounts: [...(data.discounts ?? [])],
        } : {
            billingInfo: {
                userId: undefined,
                concept: ''
            },
            baseAmount: undefined,
            discounts: [],
        };
        this.operationDate = data?.operationDate;
    }

    get operationDate(): Date | null {
        return this.operationDateValue;
    }

    set operationDate(value: Date | string | null | undefined) {
        const date = value instanceof Date ? value : this.parseDate(value);
        this.operationDateValue = date;
        this.invoice.operationDate = date ? this.formatDate(date) : undefined;
    }

    isCreate(): boolean {
        return !this.invoice.id;
    }

    setUser(user: User): void {
        this.selectedUser = user;
    }

    removeUser(): void {
        this.selectedUser = undefined;
    }

    addDiscount(): void {
        this.invoice.discounts = [...(this.invoice.discounts ?? []), 0];
    }

    removeDiscount(index: number): void {
        this.invoice.discounts = this.invoice.discounts?.filter((_, position) => position !== index) ?? [];
    }

    create(): void {
        if (!this.isCreate() || !this.canCreate()) {
            return;
        }
        this.invoiceService.create(this.buildCreation()).subscribe(() => this.dialogRef.close());
    }

    update(): void {
        if (this.isCreate() || !this.invoice.id || !this.canUpdate()) {
            return;
        }
        this.invoiceService.update(this.invoice.id, this.buildInvoice()).subscribe(() => this.dialogRef.close());
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    canCreate(): boolean {
        return !!this.selectedUser?.id && this.hasRequiredValues() && this.validDiscounts();
    }

    canUpdate(): boolean {
        return !!this.invoice.billingInfo && this.hasRequiredValues() && this.validDiscounts();
    }

    private buildCreation(): InvoiceCreation {
        return {
            userId: this.selectedUser!.id!,
            concept: this.invoice.billingInfo.concept,
            baseAmount: Number(this.invoice.baseAmount),
            discounts: this.invoice.discounts?.map(value => Number(value)) ?? []
        };
    }

    private buildInvoice(): Invoice {
        const selectedUser = this.selectedUser;
        return {
            ...this.invoice,
            billingInfo: selectedUser ? {
                userId: selectedUser.id!,
                fullName: `${selectedUser.firstName ?? ''} ${selectedUser.familyName ?? ''}`.trim(),
                identity: selectedUser.identity,
                fullAddress: this.userAddress(selectedUser),
                concept: this.invoice.billingInfo.concept
            } : this.invoice.billingInfo,
            baseAmount: Number(this.invoice.baseAmount),
            discounts: this.invoice.discounts?.map(value => Number(value)) ?? []
        };
    }

    private hasRequiredValues(): boolean {
        return !!this.invoice.billingInfo.concept?.trim()
            && Number.isFinite(Number(this.invoice.baseAmount))
            && Number(this.invoice.baseAmount) > 0;
    }

    private validDiscounts(): boolean {
        return (this.invoice.discounts ?? []).every(value => Number.isFinite(Number(value)) && Number(value) >= 0);
    }

    private userAddress(user: User): string {
        return [user.address, user.postalCode, user.city, user.province].filter(Boolean).join(', ');
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
