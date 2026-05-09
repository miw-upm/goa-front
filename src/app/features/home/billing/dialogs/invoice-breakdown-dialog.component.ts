import {Component, Inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatList, MatListItem} from '@angular/material/list';
import {InvoiceBreakdown} from '../models/invoice-breakdown.model';
import {MatButton} from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'app-invoice-breakdown-dialog',
    templateUrl: './invoice-breakdown-dialog.component.html',
    imports: [
        CommonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatTableModule,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatList,
        MatListItem,
        MatButton
    ]
})
export class InvoiceBreakdownDialogComponent {
    displayedColumns: string[] = ['id', 'taxableBase', 'vatAmount', 'amountWithVat'];

    constructor(@Inject(MAT_DIALOG_DATA) public data: InvoiceBreakdown) {
    }
}
