import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

import {TareaLegalService} from "../tarea-legal.service";
import {TareaLegal} from "../tarea-legal.model";

@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput, MatDialogActions, MatDialogClose, MatButton, NgIf],
    templateUrl: 'tarea-legal-creation-updating-dialog.component.html',
    styleUrls: ['tarea-legal-dialog.component.css']
})

export class TareaLegalCreationUpdatingDialogComponent {
    tareaLegal: TareaLegal;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: TareaLegal, private readonly tareaLegalService: TareaLegalService,
                private readonly dialog: MatDialog) {
        this.title = data ? 'Update Tarea Legal' : 'Create Tarea Legal';
        this.tareaLegal = data || {id: undefined, titulo: undefined};
    }

    create(): void {
        this.tareaLegalService
            .create(this.tareaLegal)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        this.tareaLegalService
            .update(this.tareaLegal.id, this.tareaLegal)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return this.tareaLegal.id === undefined;
    }

    invalid(): boolean {
        return this.check(this.tareaLegal.titulo);
    }

    check(attr: string): boolean {
        return attr === undefined || null || attr === '';
    }
}
