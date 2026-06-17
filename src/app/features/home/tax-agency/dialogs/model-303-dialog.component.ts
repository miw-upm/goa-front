import {CurrencyPipe} from '@angular/common';
import {Component, Inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

import {Model303} from '../models/model-303.model';

@Component({
    standalone: true,
    imports: [
        CurrencyPipe,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton
    ],
    templateUrl: 'model-303-dialog.component.html'
})
export class Model303DialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public model303: Model303) {
    }

    get vatResult(): number {
        const summary = this.model303.vatSummary;
        return this.amount(summary.invoiceIssuedVat)
            - this.amount(summary.invoiceReceivedCurrentVat)
            - this.amount(summary.invoiceReceivedInvestmentVat);
    }

    amount(value: number | string | undefined): number {
        return Number(value ?? 0);
    }
}

