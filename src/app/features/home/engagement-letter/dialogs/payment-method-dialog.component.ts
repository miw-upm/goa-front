import {Component} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-payment-method-dialog',
    templateUrl: './payment-method-dialog.component.html',
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatDialogModule, MatInputModule, MatButtonModule]
})
export class PaymentMethodDialogComponent {
    description: string = '';
    percentage: number | null = null;

    constructor(private readonly dialogRef: MatDialogRef<PaymentMethodDialogComponent>) {
    }

    save(): void {
        if (this.description.trim() && this.percentage !== null) {
            this.dialogRef.close({
                description: this.description.trim(),
                percentage: this.percentage
            });
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
