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

import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {FormTextareaComponent} from '@shared/ui/inputs/forms/form-textarea.component';
import {InvoiceService} from '../invoice.service';

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
        FormFieldComponent,
        FormTextareaComponent,
    ],
    templateUrl: 'invoice-rectification-dialog.component.html'
})
export class InvoiceRectificationDialogComponent {
    series = String(new Date().getFullYear());
    number: number | string | undefined;
    reason = '';

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly dialogRef: MatDialogRef<InvoiceRectificationDialogComponent>
    ) {
    }

    create(): void {
        if (!this.canCreate()) {
            return;
        }

        this.invoiceService.createRectification({
            series: this.series,
            number: Number(this.number),
            reason: this.reason
        }).subscribe(invoice => this.dialogRef.close(invoice));
    }

    canCreate(): boolean {
        return !!this.series.trim()
            && this.validNumber()
            && !!this.reason.trim();
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    private validNumber(): boolean {
        const value = Number(this.number);
        return Number.isInteger(value) && value >= 1 && value <= 10000;
    }
}
