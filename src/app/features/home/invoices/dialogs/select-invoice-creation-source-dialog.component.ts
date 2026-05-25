import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';

export type InvoiceCreationSource = 'manual' | 'payments' | 'third';

@Component({
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIcon,
    ],
    templateUrl: 'select-invoice-creation-source-dialog.component.html'
})
export class SelectInvoiceCreationSourceDialogComponent {
    constructor(private readonly dialogRef: MatDialogRef<SelectInvoiceCreationSourceDialogComponent>) {
    }

    select(source: InvoiceCreationSource): void {
        this.dialogRef.close(source);
    }
}
