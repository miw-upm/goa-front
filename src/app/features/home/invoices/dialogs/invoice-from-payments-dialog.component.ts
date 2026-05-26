import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';

import {SearchByEngagementLetterComponent} from '@features/shared/ui/search-by-engagement-letter.component';
import {EngagementLetter} from '../../engagement-letter/models/engagement-letter.model';
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
        MatIconButton,
        MatIcon,
        MatFormField,
        MatLabel,
        MatInput,
        SearchByEngagementLetterComponent,
    ],
    templateUrl: 'invoice-from-payments-dialog.component.html'
})
export class InvoiceFromPaymentsDialogComponent {
    selectedEngagementLetter?: EngagementLetter;
    discounts: number[] = [];

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly dialogRef: MatDialogRef<InvoiceFromPaymentsDialogComponent>
    ) {
    }

    setEngagementLetter(engagementLetter: EngagementLetter): void {
        this.selectedEngagementLetter = engagementLetter;
    }

    removeEngagementLetter(): void {
        this.selectedEngagementLetter = undefined;
    }

    addDiscount(): void {
        this.discounts = [...this.discounts, 0];
    }

    removeDiscount(index: number): void {
        this.discounts = this.discounts.filter((_, position) => position !== index);
    }

    canCreate(): boolean {
        return !!this.selectedEngagementLetter?.id && this.validDiscounts();
    }

    create(): void {
        const engagementId = this.selectedEngagementLetter?.id;
        if (!engagementId || !this.canCreate()) {
            return;
        }
        this.invoiceService.createFromPayments({
            engagementId,
            discounts: this.discounts.map(value => Number(value))
        })
            .subscribe(() => this.dialogRef.close(true));
    }

    private validDiscounts(): boolean {
        return this.discounts.every(value => Number.isFinite(Number(value)) && Number(value) >= 0);
    }
}
