import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';
import {MatDialog} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {FormListComponent} from '@shared/ui/inputs/forms/list.component';
import {SearchByUserComponent} from '@features/shared/ui/search-by-user.component';
import {
    SearchByLegalProcedureTemplateComponent
} from '@features/shared/ui/search-by-legal-procedure-template.component';
import {User} from '@features/shared/models/user.model';
import {LegalProcedureTemplate} from '@features/shared/models/legal-procedure-template.model';

import {EngagementLetterService} from '../engagement-letter.service';
import {EngagementLetter} from '../models/engagement-letter.model';
import {LegalProcedure} from '../models/legal-procedure.model';
import {LegalProcedureEditDialogComponent} from "../dialogs/legal-procedure-edit-dialog.component";

@Component({
    standalone: true,
    selector: 'app-engagement-letter-form',
    providers: [DatePipe, EngagementLetterService],
    templateUrl: 'engagement-letter-form.component.html',
    styleUrls: ['engagement-letter-form.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        MatListModule,
        MatCardModule,
        MatSlideToggleModule,
        SearchByUserComponent,
        SearchByLegalProcedureTemplateComponent,
        MatTooltipModule,
        AppDateFieldComponent,
        FormListComponent
    ],
})
export class EngagementLetterFormComponent implements OnInit {
    engagementLetter: EngagementLetter;
    title: string;
    isEditMode = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly datePipe: DatePipe,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly dialog: MatDialog
    ) {
        this.engagementLetter = this.createEmptyEngagementLetter();
        this.title = 'Crear Hoja de Encargo';
    }

    get ownerAsArray(): any[] {
        return this.engagementLetter.owner ? [this.engagementLetter.owner] : [];
    }

    set ownerAsArray(list: any[]) {
        this.engagementLetter.owner = list[0];
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.title = 'Actualizar Hoja de Encargo';
            this.engagementLetterService.read(id).subscribe(data => {
                this.engagementLetter = {
                    ...data,
                    creationDate: data.creationDate ? new Date(data.creationDate) : undefined,
                    closingDate: data.closingDate ? new Date(data.closingDate) : undefined
                };
            });
        }
    }

    save(): void {
        if (this.isEditMode) {
            this.update();
        } else {
            this.create();
        }
    }

    create(): void {
        this.engagementLetterService.create(this.engagementLetter).subscribe(() => {
            this.router.navigate(['/home/engagement-letters']);
        });
    }

    update(): void {
        const engagementLetterToSend = {
            ...this.engagementLetter,
            closingDate: this.engagementLetter.closingDate
                ? this.datePipe.transform(this.engagementLetter.closingDate, 'yyyy-MM-dd')
                : null
        } as EngagementLetter;

        this.engagementLetterService.update(this.engagementLetter.id, engagementLetterToSend).subscribe(() => {
            this.router.navigate(['/home/engagement-letters']);
        });
    }

    private formatDate(date: Date | string | undefined): string | undefined {
        if (!date) return undefined;
        return this.datePipe.transform(date, 'yyyy-MM-dd') ?? undefined;
    }

    cancel(): void {
        this.router.navigate(['/home/engagement-letters']);
    }

    invalid(): boolean {
        const owner = this.checkInvalid(this.engagementLetter.owner?.mobile);
        const procedures = this.checkInvalid(this.engagementLetter.legalProcedures);
        return owner || procedures;
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

    addAttachment(user: User): void {
        const alreadyInAttachments = this.engagementLetter.attachments.some(t => t.mobile === user.mobile);
        const isOwner = this.engagementLetter.owner?.mobile === user.mobile;
        if (!alreadyInAttachments && !isOwner) {
            this.engagementLetter.attachments.push(user);
        }
    }

    addProcedure(template: LegalProcedureTemplate): void {
        const procedure: LegalProcedure = {
            id: crypto.randomUUID(),
            title: template.title,
            budget: template.budget,
            vatIncluded: false,
            legalTasks: template.legalTasks?.map(task => task.title) ?? [],
            startDate: undefined,
            closingDate: undefined
        };
        const title = (template?.title || '').trim();
        if (title && !this.engagementLetter.legalProcedures.some(proc => proc.title === title)) {
            this.engagementLetter.legalProcedures.push(procedure);
        }
    }

    addPaymentMethod(): void {
        this.engagementLetter.paymentMethods.push({percentage: '', description: ''});
    }

    removePaymentMethod(index: number): void {
        this.engagementLetter.paymentMethods.splice(index, 1);
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

    private createEmptyEngagementLetter(): EngagementLetter {
        return {
            id: undefined,
            budgetOnly: true,
            discount: 0,
            creationDate: undefined,
            closingDate: undefined,
            owner: undefined,
            attachments: [],
            legalProcedures: [],
            paymentMethods: [{description: 'Al finalizar el proceso', percentage: 'Resto'}],
            acceptanceDocuments: undefined
        };
    }
}