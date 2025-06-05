import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';

import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

import {EngagementLetter} from '../engagement-letter.model';
import {EngagementLetterService} from '../engagement-letter.service';
import {SearchByUserComponent} from '@shared/components/search-by-user.component';
import {User} from "@shared/models/user.model";
import {SearchByLegalProcedureComponent} from "@shared/components/search-by-legal-procedure.component";
import {LegalProcedure} from "../legal-procedure.model";
import {MatChipsModule} from "@angular/material/chips";
import {MatListModule} from "@angular/material/list";
import {PaymentMethod} from "../payment-method.model";
import {PaymentMethodDialogComponent} from "./payment-method-dialog.component";

@Component({
    standalone: true,
    selector: 'app-engagement-letter-creation-updating-dialog',
    templateUrl: 'engagement-letter-creation-updating-dialog.component.html',
    styleUrls: ['engagement-letter-dialog.component.css'],
    imports: [
        FormsModule,
        NgIf,
        DatePipe,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        MatListModule,
        SearchByUserComponent,
        SearchByLegalProcedureComponent,
    ]
})
export class EngagementLetterCreationUpdatingDialogComponent {
    engagementLetter: EngagementLetter;
    title: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: EngagementLetter,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly dialog: MatDialog
    ) {
        this.title = data ? 'Actualizar Hoja de Encargo' : 'Crear Hoja de Encargo';
        this.engagementLetter = {
            id: undefined,
            discount: 0,
            creationDate: data?.creationDate ? new Date(data.creationDate) : undefined,
            closingDate: data?.closingDate ? new Date(data.closingDate) : undefined,
            owner: {mobile: undefined, firstName: undefined},
            attachments: [],
            legalProcedures: [],
            paymentMethods: [{ description: 'Provisión de Fondos', percentage: 40},{ description: 'Al finalizar el proceso', percentage: 60}],
            acceptanceDocuments: undefined,
            ...(data || {})
        };
    }

    create(): void {
        this.engagementLetterService
            .create(this.engagementLetter)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        this.engagementLetterService
            .update(this.engagementLetter.id, this.engagementLetter)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return this.engagementLetter.id === undefined;
    }

    invalid(): boolean {
        const d = this.checkInvalid(this.engagementLetter.discount);
        const o = this.checkInvalid(this.engagementLetter.owner.mobile);
        const l = this.checkInvalid(this.engagementLetter.legalProcedures);
        const p = this.checkInvalid(this.engagementLetter.paymentMethods);
        const validSum = this.isPaymentTotalValid();

        console.log({ discount: d, owner: o, legalProcedures: l, paymentMethods: p, totalValid: validSum });

        return d || o || l || p || !validSum;
    }


    checkInvalid(attr: string | number | null | undefined | object): boolean {
        return (
            attr === undefined ||
            attr === null ||
            (typeof attr === 'string' && attr.trim() === '') ||
            (typeof attr === 'number' && isNaN(attr)) ||
            (Array.isArray(attr) && attr.length === 0)
        );
    }

    isPaymentTotalValid(): boolean {
        const payments = this.engagementLetter.paymentMethods ?? [];
        const total = payments.reduce((sum, p) => sum + (p.percentage || 0), 0);
        return total === 100;
    }

    removeAtachment(attachment: User) {
        const index = this.engagementLetter.attachments?.indexOf(attachment);
        if (index !== undefined && index >= 0) {
            this.engagementLetter.attachments.splice(index, 1);
        }
    }

    addAttachment(value) {
        const mobile = (value || '').trim();
        if (mobile && !this.engagementLetter.attachments.some(t => t.mobile === mobile)) {
            this.engagementLetter.attachments.push({mobile: mobile, firstName: undefined});
        }
    }

    addProcedure(value) {
        const title = (value || '').trim();
        if (title && !this.engagementLetter.legalProcedures.some(t => t.title === title)) {
            this.engagementLetter.legalProcedures.push({title: title});
        }
    }

    removeProcedure(procedure: LegalProcedure) {
        const index = this.engagementLetter.legalProcedures?.indexOf(procedure);
        if (index !== undefined && index >= 0) {
            this.engagementLetter.legalProcedures.splice(index, 1);
        }
    }

    removePaymentMethod(method: PaymentMethod): void {
        this.engagementLetter.paymentMethods =
            this.engagementLetter.paymentMethods?.filter(m => m !== method) ?? [];
    }

    openDialog(): void {
        this.dialog.open(PaymentMethodDialogComponent).afterClosed().subscribe((result: PaymentMethod | undefined) => {
            if (result) {
                if (!this.engagementLetter.paymentMethods) {
                    this.engagementLetter.paymentMethods = [];
                }
                this.engagementLetter.paymentMethods.push(result);
            }
        });
    }
}
