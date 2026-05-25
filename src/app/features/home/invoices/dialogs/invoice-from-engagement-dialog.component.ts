import {Component} from '@angular/core';
import {NgModel} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';

import {SearchByEngagementLetterComponent} from '@features/shared/ui/search-by-engagement-letter.component';
import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {EngagementLetter} from '../../engagement-letter/models/engagement-letter.model';
import {InvoiceService} from '../invoice.service';

@Component({
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIconButton,
        MatIcon,
        SearchByEngagementLetterComponent,
        FormFieldComponent,
    ],
    templateUrl: 'invoice-from-engagement-dialog.component.html'
})
export class InvoiceFromEngagementDialogComponent {
    selectedEngagementLetter?: EngagementLetter;
    concept = '';
    totalBaseAmount?: number;

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

    canCreate(): boolean {
        return !!this.selectedEngagementLetter?.id
            && !!this.concept.trim()
            && Number.isFinite(Number(this.totalBaseAmount))
            && Number(this.totalBaseAmount) > 0;
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
            concept: this.concept.trim()
        }).subscribe(() => this.dialogRef.close(true));
    }
}
