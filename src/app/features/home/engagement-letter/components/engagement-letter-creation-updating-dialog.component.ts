import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';

import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatChipsModule} from "@angular/material/chips";
import {MatListModule} from "@angular/material/list";

import {SearchByUserComponent} from '../../../common/components/search-by-user.component';
import {SearchByLegalProcedureTemplateComponent} from "../../../common/components/search-by-legal-procedure-template.component";
import {User} from "../../../common/models/user.model";
import {LegalProcedureTemplate} from "../../../common/models/legal-procedure-template.model";
import {LegalProcedureEditDialogComponent} from "./legal-procedure-edit-dialog.component";
import {EngagementLetterService} from '../engagement-letter.service';
import {PaymentMethodDialogComponent} from "./payment-method-dialog.component";
import {EngagementLetter} from '../models/engagement-letter.model';
import {LegalProcedure} from "../models/legal-procedure.model";
import {PaymentMethod} from "../models/payment-method.model";
import {FormFieldComponent} from "@shared/ui/inputs/forms/field.component";
import {AppDateFieldComponent} from "@shared/ui/inputs/forms/data.component";
import {FormListComponent} from "@shared/ui/inputs/forms/list.component";

@Component({
    standalone: true,
    selector: 'app-engagement-letter-creation-updating-dialog',
    providers: [DatePipe, EngagementLetterService],
    templateUrl: 'engagement-letter-creation-updating-dialog.component.html',
    styleUrls: ['engagement-letter-dialog.component.css'],
    imports: [
        CommonModule,
        FormsModule,
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
        SearchByLegalProcedureTemplateComponent,
        MatTooltipModule,
        FormFieldComponent,
        AppDateFieldComponent,
        FormListComponent
    ],

})
export class EngagementLetterCreationUpdatingDialogComponent {
    engagementLetter: EngagementLetter;
    title: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: EngagementLetter,
        private readonly datePipe: DatePipe,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly dialog: MatDialog
    ) {
        this.title = data ? 'Actualizar Hoja de Encargo' : 'Crear Hoja de Encargo';
        this.engagementLetter = {
            id: undefined,
            discount: 0,
            creationDate: data?.creationDate ? new Date(data.creationDate) : undefined,
            closingDate: data?.closingDate ? new Date(data.closingDate) : undefined,
            owner: undefined,
            attachments: [],
            legalProcedures: [],
            paymentMethods: [{
                description: 'Provisión de Fondos',
                percentage: 40
            }, {description: 'Al finalizar el proceso', percentage: 60}],
            acceptanceDocuments: undefined,
            ...(data || {})
        };
    }

    get ownerAsArray(): any[] {
        return this.engagementLetter.owner ? [this.engagementLetter.owner] : [];
    }

    set ownerAsArray(list: any[]) {
        this.engagementLetter.owner = list[0]; // solo tomas el primero
    }

    create(): void {
        this.engagementLetterService
            .create(this.engagementLetter)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        const formattedDate = this.datePipe.transform(this.engagementLetter.closingDate, 'yyyy-MM-dd');
        this.engagementLetter.closingDate = formattedDate as any;

        console.log(JSON.parse(JSON.stringify(this.engagementLetter)));

        this.engagementLetterService
            .update(this.engagementLetter.id, this.engagementLetter)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return this.engagementLetter.id === undefined;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    invalid(): boolean {
        const owner = this.checkInvalid(this.engagementLetter.owner?.mobile);
        const procedures = this.checkInvalid(this.engagementLetter.legalProcedures);
        const payments = this.checkInvalid(this.engagementLetter.paymentMethods);
        const validSum = this.isPaymentTotalValid();
        return owner || procedures || payments || !validSum;
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

    addAttachment(user: User) {
        const alreadyInAttachments = this.engagementLetter.attachments.some(t => t.mobile === user.mobile);
        const isOwner = this.engagementLetter.owner?.mobile === user.mobile;
        if (!alreadyInAttachments && !isOwner) {
            this.engagementLetter.attachments.push(user);
        }
    }

    addProcedure(template: LegalProcedureTemplate) {
        const procedure: LegalProcedure = {
            id: template.id,
            title: template.title,
            budget: template.budget,
            vatIncluded: false,
            legalTasks: template.legalTasks?.map(task => task.title) ?? [],
            startDate: undefined,
            closingDate: undefined
        }
        const title = (template?.title || '').trim();
        if (title && !this.engagementLetter.legalProcedures.some(proc => proc.title === title)) {
            this.engagementLetter.legalProcedures.push(procedure);
        }
    }

    addLegalProcedureDialog(): void {
        this.dialog.open(PaymentMethodDialogComponent).afterClosed().subscribe((result: PaymentMethod | undefined) => {
            if (result) {
                if (!this.engagementLetter.paymentMethods) {
                    this.engagementLetter.paymentMethods = [];
                }
                this.engagementLetter.paymentMethods.push(result);
            }
        });
    }

    editLegalProcedureDialog(procedure: LegalProcedure): void {
        this.dialog.open(LegalProcedureEditDialogComponent, {
            data: procedure,
            width: '900px',
        }).afterClosed().subscribe((result: LegalProcedure | undefined) => {
            if (result) {
                const index = this.engagementLetter.legalProcedures.findIndex(p => p.id === procedure.id);
                if (index !== -1) {
                    this.engagementLetter.legalProcedures[index] = result;
                }
            }
        });
    }
}
