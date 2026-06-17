import {Component, Inject} from '@angular/core';
import {NgModel} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';

import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {FormSelectComponent} from '@shared/ui/inputs/forms/form-select.component';
import {Quarter} from '../models/quarter.model';

export type InvoiceIssuedBookDialogResult = {
    year: number;
    quarter: Quarter;
    from?: number;
    to?: number;
};

export type InvoiceIssuedBookDialogData = {
    title: string;
    submitLabel?: string;
    submitIcon?: string;
    showRange?: boolean;
    showTo?: boolean;
};

@Component({
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIcon,
        FormFieldComponent,
        FormSelectComponent
    ],
    templateUrl: 'invoice-issued-book-dialog.component.html'
})
export class InvoiceIssuedBookDialogComponent {
    readonly title: string;
    readonly submitLabel: string;
    readonly submitIcon: string;
    readonly showRange: boolean;
    readonly showTo: boolean;
    readonly quarters: Observable<string[]> = of(['T1', 'T2', 'T3', 'T4']);
    readonly quarterLabels: Record<string, string> = {
        T1: 'T1 (enero - marzo)',
        T2: 'T2 (abril - junio)',
        T3: 'T3 (julio - septiembre)',
        T4: 'T4 (octubre - diciembre)'
    };
    year = new Date().getFullYear();
    quarter: Quarter | undefined = this.currentQuarter();
    from: number | undefined;
    to: number | undefined;

    constructor(
        private readonly dialogRef: MatDialogRef<InvoiceIssuedBookDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data?: InvoiceIssuedBookDialogData
    ) {
        this.title = data?.title ?? 'Libro de facturas expedidas';
        this.submitLabel = data?.submitLabel ?? 'Descargar CSV';
        this.submitIcon = data?.submitIcon ?? 'download';
        this.showRange = data?.showRange ?? false;
        this.showTo = this.showRange || (data?.showTo ?? false);
    }

    download(): void {
        if (!this.canDownload()) {
            return;
        }
        this.dialogRef.close({
            year: Number(this.year),
            quarter: this.quarter,
            ...(this.showRange ? {from: Number(this.from)} : {}),
            ...(this.showTo ? {to: Number(this.to)} : {})
        } satisfies InvoiceIssuedBookDialogResult);
    }

    canDownload(): boolean {
        return Number.isInteger(Number(this.year))
            && Number(this.year) >= 2000
            && Number(this.year) <= 2100
            && !!this.quarter
            && this.validFrom()
            && this.validTo()
            && !this.rangeOrderInvalid();
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    rangeOrderInvalid(): boolean {
        if (!this.showRange || this.from === undefined || this.to === undefined) {
            return false;
        }
        return this.validFrom() && this.validTo() && Number(this.from) >= Number(this.to);
    }

    private currentQuarter(): Quarter {
        const month = new Date().getMonth() + 1;
        if (month <= 3) return 'T1';
        if (month <= 6) return 'T2';
        if (month <= 9) return 'T3';
        return 'T4';
    }

    private validFrom(): boolean {
        if (!this.showRange) {
            return true;
        }
        return this.isRequiredInteger(this.from);
    }

    private validTo(): boolean {
        if (!this.showTo) {
            return true;
        }
        return this.isRequiredInteger(this.to);
    }

    private isRequiredInteger(value: number | string | undefined): boolean {
        return value !== undefined
            && value !== ''
            && Number.isInteger(Number(value));
    }
}
