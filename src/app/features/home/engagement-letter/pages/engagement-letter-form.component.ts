import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatDialog} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {FormListComponent} from '@shared/ui/inputs/forms/list.component';
import {SearchByUserComponent} from '@features/shared/ui/search-by-user.component';
import {SearchByLegalProcedureTemplateComponent} from '@features/shared/ui/search-by-legal-procedure-template.component';
import {User} from '@features/shared/models/user.model';
import {LegalProcedureTemplate} from '../../legal-procedure-templates/models/legal-procedure-template.model';

import {EngagementLetterService} from '../engagement-letter.service';
import {EngagementLetter} from '../models/engagement-letter.model';
import {LegalProcedure} from '../models/legal-procedure.model';
import {LegalProcedureEditDialogComponent} from '../dialogs/legal-procedure-edit-dialog.component';
import {CancelYesDialogComponent} from "@shared/ui/dialogs/cancel-yes-dialog.component";

@Component({
    standalone: true,
    selector: 'app-engagement-letter-form',
    providers: [DatePipe, EngagementLetterService],
    templateUrl: 'engagement-letter-form.component.html',
    styleUrls: ['engagement-letter-form.component.css'],
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatCardModule,
        MatSlideToggleModule,
        SearchByUserComponent,
        SearchByLegalProcedureTemplateComponent,
        AppDateFieldComponent,
        FormListComponent
    ],
})
export class EngagementLetterFormComponent implements OnInit {
    engagementLetter: EngagementLetter;
    title = 'Crear Hoja de Encargo';
    isEditMode = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly datePipe: DatePipe,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly dialog: MatDialog
    ) {
        this.engagementLetter = this.createEmptyEngagementLetter();
    }

    get ownerAsArray(): User[] {
        return this.engagementLetter.owner ? [this.engagementLetter.owner] : [];
    }

    set ownerAsArray(list: User[]) {
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
        this.isEditMode ? this.update() : this.create();
    }

    create(): void {
        this.engagementLetterService.create(this.prepareForSend()).subscribe(() => {
            this.navigateBack();
        });
    }

    update(): void {
        this.engagementLetterService.update(this.engagementLetter.id, this.prepareForSend()).subscribe(() => {
            this.navigateBack();
        });
    }

    cancel(): void {
        this.router.navigate(['/home/engagement-letters'], {
            queryParamsHandling: 'preserve'
        });
    }

    invalid(): boolean {
        return this.checkInvalid(this.engagementLetter.owner?.mobile) ||
            this.checkInvalid(this.engagementLetter.legalProcedures);
    }

    addAttachment(user: User): void {
        const alreadyInAttachments = this.engagementLetter.attachments.some(t => t.mobile === user.mobile);
        const isOwner = this.engagementLetter.owner?.mobile === user.mobile;
        if (!alreadyInAttachments && !isOwner) {
            this.engagementLetter.attachments.push(user);
        }
    }

    addProcedure(template: LegalProcedureTemplate): void {
        const title = (template?.title || '').trim();
        if (title && !this.engagementLetter.legalProcedures.some(proc => proc.title === title)) {
            this.engagementLetter.legalProcedures.push({
                title: template.title,
                budget: template.budget,
                vatIncluded: false,
                legalTasks: template.legalTasks?.map(task => task.title) ?? []
            });
        }
    }

    addPaymentMethod(): void {
        this.engagementLetter.paymentMethods.push({percentage: '', description: ''});
    }

    removePaymentMethod(index: number): void {
        this.dialog.open(CancelYesDialogComponent, {
            data: {
                title: 'Eliminar método de pago',
                message: '¿Estás seguro de eliminar este método de pago?'
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                this.engagementLetter.paymentMethods.splice(index, 1);
            }
        });
    }

    editLegalProcedureDialog(procedure: LegalProcedure): void {
        const index = this.engagementLetter.legalProcedures.indexOf(procedure);
        this.dialog.open(LegalProcedureEditDialogComponent, {
            data: procedure,
            width: '900px',
        }).afterClosed().subscribe((result: LegalProcedure | undefined) => {
            if (result && index !== -1) {
                this.engagementLetter.legalProcedures[index] = result;
            }
        });
    }

    private prepareForSend(): EngagementLetter {
        return {
            ...this.engagementLetter,
            creationDate: this.formatDate(this.engagementLetter.creationDate),
            closingDate: this.formatDate(this.engagementLetter.closingDate),
            legalProcedures: this.engagementLetter.legalProcedures.map(proc => ({
                ...proc,
                startDate: this.formatDate(proc.startDate),
                closingDate: this.formatDate(proc.closingDate)
            }))
        } as EngagementLetter;
    }

    private formatDate(date: Date | string | undefined | null): string | null {
        if (!date) return null;
        if (date instanceof Date) {
            return this.datePipe.transform(date, 'yyyy-MM-dd');
        }
        if (typeof date === 'string' && date.includes('T')) {
            return date.split('T')[0];
        }
        return date;
    }

    private checkInvalid(attr: string | number | null | undefined | object): boolean {
        return (
            attr === undefined ||
            attr === null ||
            (typeof attr === 'string' && attr.trim() === '') ||
            (typeof attr === 'number' && isNaN(attr)) ||
            (Array.isArray(attr) && attr.length === 0)
        );
    }

    private createEmptyEngagementLetter(): EngagementLetter {
        return {
            budgetOnly: true,
            discount: 0,
            attachments: [],
            legalProcedures: [],
            paymentMethods: [{description: 'Al finalizar el proceso', percentage: 'Resto'}]
        };
    }

    private navigateBack(): void {
        const client = this.engagementLetter.owner?.mobile;
        this.router.navigate(['/home/engagement-letters'], {
            queryParams: { client, opened: true }
        });
    }
}
