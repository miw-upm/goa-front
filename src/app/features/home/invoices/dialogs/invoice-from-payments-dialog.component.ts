import {Component} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';

import {SearchByEngagementLetterComponent} from '@features/shared/ui/search-by-engagement-letter.component';
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
    ],
    templateUrl: 'invoice-from-payments-dialog.component.html'
})
export class InvoiceFromPaymentsDialogComponent {
    selectedEngagementLetter?: EngagementLetter;

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

    create(): void {
        const engagementId = this.selectedEngagementLetter?.id;
        if (!engagementId) {
            return;
        }
        this.invoiceService.createFromPayments({engagementId})
            .subscribe(() => this.dialogRef.close(true));
    }
}
