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

import {Model130} from '../models/model-130.model';

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
    templateUrl: 'model-130-dialog.component.html'
})
export class Model130DialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public model130: Model130) {
    }

    get netIncome(): number {
        const breakdown = this.model130.netIncomeBreakdown;
        return this.amount(breakdown.income)
            - this.amount(breakdown.currentExpenses)
            - this.amount(breakdown.investmentAmortization);
    }

    amount(value: number | string | undefined): number {
        return Number(value ?? 0);
    }
}

