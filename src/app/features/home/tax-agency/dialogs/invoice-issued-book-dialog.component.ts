import {Component} from '@angular/core';
import {NgModel} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';

import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {FormSelectComponent} from '@shared/ui/inputs/forms/form-select.component';
import {Quarter} from '../models/quarter.model';

export type InvoiceIssuedBookDialogResult = {
    year: number;
    quarter: Quarter;
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
    readonly quarters: Observable<string[]> = of(['T1', 'T2', 'T3', 'T4']);
    readonly quarterLabels: Record<string, string> = {
        T1: 'T1 (enero - marzo)',
        T2: 'T2 (abril - junio)',
        T3: 'T3 (julio - septiembre)',
        T4: 'T4 (octubre - diciembre)'
    };
    year = new Date().getFullYear();
    quarter: Quarter | undefined = this.currentQuarter();

    constructor(private readonly dialogRef: MatDialogRef<InvoiceIssuedBookDialogComponent>) {
    }

    download(): void {
        if (!this.canDownload()) {
            return;
        }
        this.dialogRef.close({
            year: Number(this.year),
            quarter: this.quarter
        } satisfies InvoiceIssuedBookDialogResult);
    }

    canDownload(): boolean {
        return Number.isInteger(Number(this.year))
            && Number(this.year) >= 2000
            && Number(this.year) <= 2100
            && !!this.quarter;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    private currentQuarter(): Quarter {
        const month = new Date().getMonth() + 1;
        if (month <= 3) return 'T1';
        if (month <= 6) return 'T2';
        if (month <= 9) return 'T3';
        return 'T4';
    }
}

