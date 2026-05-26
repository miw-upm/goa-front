import {Component} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';

import {SearchByEngagementLetterComponent} from '@features/shared/ui/search-by-engagement-letter.component';
import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {EngagementLetter} from '../../engagement-letter/models/engagement-letter.model';
import {InvoiceService} from '../invoice.service';
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
        SearchByEngagementLetterComponent,
        FormFieldComponent,
        FormTextareaComponent,
    ],
    templateUrl: 'invoice-from-engagement-dialog.component.html'
})
export class InvoiceFromEngagementDialogComponent {
    selectedEngagementLetter?: EngagementLetter;
    concept = '';
    totalBaseAmount?: number;
    discounts: number[] = [];

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly dialogRef: MatDialogRef<InvoiceFromEngagementDialogComponent>
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
        return !!this.selectedEngagementLetter?.id
            && !!this.concept.trim()
            && Number.isFinite(Number(this.totalBaseAmount))
            && Number(this.totalBaseAmount) > 0
            && this.validDiscounts();
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    create(): void {
        const engagementId = this.selectedEngagementLetter?.id;
        if (!engagementId || !this.canCreate()) {
            return;
        }
        this.invoiceService.createFromEngagement({
            engagementId,
            totalBaseAmount: Number(this.totalBaseAmount),
            concept: this.concept.trim(),
            discounts: this.discounts.map(value => Number(value))
        }).subscribe(() => this.dialogRef.close(true));
    }

    private validDiscounts(): boolean {
        return this.discounts.every(value => Number.isFinite(Number(value)) && Number(value) >= 0);
    }
}
