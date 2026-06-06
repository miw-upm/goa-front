import {Component} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatSlideToggle} from '@angular/material/slide-toggle';

import {
    LegalProcedureEditDialogComponent
} from '../../../engagement-letter/engagement-letter/dialogs/legal-procedure-edit-dialog.component';
import {EngagementLetter} from '../../../engagement-letter/engagement-letter/models/engagement-letter.model';
import {LegalProcedure} from '../../../engagement-letter/engagement-letter/models/legal-procedure.model';
import {LegalProcedureTemplate} from '../../../engagement-letter/legal-procedure-templates/models/legal-procedure-template.model';
import {InvoiceService} from '../invoice.service';
import {User} from "@features/shared/models/user.model";
import {SearchByEngagementLetterComponent} from "@features/shared/ui/search-by-engagement-letter.component";
import {
    SearchByLegalProcedureTemplateComponent
} from "@features/shared/ui/search-by-legal-procedure-template.component";
import {FormListComponent} from "@shared/ui/inputs/forms/form-list.component";
import {FormTextareaComponent} from "@shared/ui/inputs/forms/form-textarea.component";

interface CustomerBillingPercentage {
    user: User;
    percentage: number;
}

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
        MatSuffix,
        MatInput,
        MatSlideToggle,
        SearchByEngagementLetterComponent,
        SearchByLegalProcedureTemplateComponent,
        FormListComponent,
        FormTextareaComponent,
    ],
    templateUrl: 'invoice-from-engagement-dialog.component.html'
})
export class InvoiceFromEngagementDialogComponent {
    selectedEngagementLetter?: EngagementLetter;
    closeEngagement = false;
    concept = '';
    legalProcedures: LegalProcedure[] = [];
    billingPercentages: CustomerBillingPercentage[] = [];

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly dialog: MatDialog,
        private readonly dialogRef: MatDialogRef<InvoiceFromEngagementDialogComponent>
    ) {
    }

    setEngagementLetter(engagementLetter: EngagementLetter): void {
        this.selectedEngagementLetter = engagementLetter;
        this.legalProcedures = (engagementLetter.legalProcedures ?? []).map(procedure => ({
            ...procedure,
            legalTasks: [...(procedure.legalTasks ?? [])]
        }));
        this.billingPercentages = this.createBillingPercentages(engagementLetter);
    }

    removeEngagementLetter(): void {
        this.selectedEngagementLetter = undefined;
        this.concept = '';
        this.legalProcedures = [];
        this.billingPercentages = [];
    }

    addProcedure(template: LegalProcedureTemplate): void {
        const title = template?.title?.trim();
        if (title && !this.legalProcedures.some(procedure => procedure.title === title)) {
            this.legalProcedures = [...this.legalProcedures, {
                title: template.title,
                budget: template.budget,
                vatIncluded: false,
                legalTasks: template.legalTasks?.map(task => task.title) ?? []
            }];
        }
    }

    editLegalProcedureDialog(procedure: LegalProcedure): void {
        const index = this.legalProcedures.indexOf(procedure);
        this.dialog.open(LegalProcedureEditDialogComponent, {
            data: procedure,
            width: '900px',
        }).afterClosed().subscribe((result: LegalProcedure | undefined) => {
            if (result && index !== -1) {
                this.legalProcedures[index] = result;
                this.legalProcedures = [...this.legalProcedures];
            }
        });
    }

    canCreate(): boolean {
        return !!this.selectedEngagementLetter?.id
            && this.legalProcedures.length > 0
            && this.validBillingPercentages();
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    billingPercentageTotal(): number {
        return this.billingPercentages.reduce((total, item) => total + Number(item.percentage || 0), 0);
    }

    create(): void {
        const engagementId = this.selectedEngagementLetter?.id;
        if (!engagementId || !this.canCreate()) {
            return;
        }
        this.invoiceService.createFromEngagement({
            engagementId,
            concept: this.concept,
            closeEngagement: this.closeEngagement,
            legalProcedures: this.legalProcedures.map(procedure => ({
                ...procedure,
                startDate: this.formatDate(procedure.startDate),
                closingDate: this.formatDate(procedure.closingDate)
            })),
            billingPercentages: this.billingPercentages.map(item => ({
                userId: item.user.id!,
                percentage: Number(item.percentage)
            }))
        }).subscribe(() => this.dialogRef.close(this.selectedEngagementLetter?.reference));
    }

    private createBillingPercentages(engagementLetter: EngagementLetter): CustomerBillingPercentage[] {
        const clients = [engagementLetter.owner, ...(engagementLetter.attachments ?? [])]
            .filter((user): user is User => !!user)
            .filter((user, index, all) => all.findIndex(other => this.sameUser(other, user)) === index);

        const percentages = this.distributePercentages(clients.length);
        return clients.map((user, index) => ({
            user,
            percentage: percentages[index]
        }));
    }

    private distributePercentages(count: number): number[] {
        if (count <= 0) {
            return [];
        }
        const percentage = Number((100 / count).toFixed(4));
        const percentages = Array(count).fill(percentage);
        const accumulated = percentages
            .slice(0, count - 1)
            .reduce((total, value) => total + value, 0);
        percentages[count - 1] = Number((100 - accumulated).toFixed(4));
        return percentages;
    }

    private validBillingPercentages(): boolean {
        return this.billingPercentages.length > 0
            && this.billingPercentages.every(item => !!item.user.id
                && Number.isFinite(Number(item.percentage))
                && Number(item.percentage) >= 0
                && Number(item.percentage) <= 100)
            && Math.abs(this.billingPercentageTotal() - 100) < 0.000001;
    }

    private sameUser(first: User, second: User): boolean {
        return first.id && second.id ? first.id === second.id : first.mobile === second.mobile;
    }

    private formatDate(date: Date | string | null | undefined): string | undefined {
        if (!date) {
            return undefined;
        }
        if (date instanceof Date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return date.includes('T') ? date.split('T')[0] : date;
    }
}
