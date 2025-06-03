import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {SearchByTareaLegalComponent} from "@shared/components/search-by-tarea-legal.component";
import {MatList, MatListItem} from "@angular/material/list";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {EngagementLetter} from "../engagement-letter.model";
import {EngagementLetterService} from "../engagement-letter.service";
import {SearchByUserComponent} from "@shared/components/search-by-user.component";


@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput, MatDialogActions,
        MatDialogClose, MatButton, NgIf, DatePipe, MatCheckbox, MatIcon, MatSuffix, SearchByTareaLegalComponent,
        MatList, MatListItem, MatIconButton, MatDatepickerToggle, MatDatepicker, MatDatepickerInput, MatNativeDateModule, SearchByUserComponent],
    templateUrl: 'engagement-letter-creation-updating-dialog.component.html',
    styleUrls: ['engagement-letter-dialog.component.css']
})

export class EngagementLetterCreationUpdatingDialogComponent {
    engagementLetter: EngagementLetter;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: EngagementLetter, private readonly engagementLetterService: EngagementLetterService,
                private readonly dialog: MatDialog) {
        this.title = data ? 'Actualizar Hoja de Encargo' : 'Crear Hoja de Encargo';
        this.engagementLetter = {
            id: undefined,
            discount: 0,
            creationDate: data?.creationDate ? new Date(data.creationDate) : undefined,
            closingDate: data?.closingDate ? new Date(data.closingDate) : undefined,
            owner: undefined,
            attachments: undefined,
            legalProcedures: undefined,
            paymentMethods: undefined,
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
        return this.check(this.engagementLetter.discount)
            && this.check(this.engagementLetter.owner)
            && this.check(this.engagementLetter.legalProcedures)
            && this.check(this.engagementLetter.paymentMethods);
    }

    check(attr: string | number | null | undefined | object): boolean {
        return (
            attr === undefined ||
            attr === null ||
            (typeof attr === 'string' && attr.trim() === '') ||
            (typeof attr === 'number' && isNaN(attr))
        );
    }

}