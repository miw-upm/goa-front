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

import {LegalTaskService} from "../legal-task.service";
import {LegalTask} from "../legal-task.model";

@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput, MatDialogActions, MatDialogClose, MatButton, NgIf],
    templateUrl: 'legal-task-creation-updating-dialog.component.html',
    styleUrls: ['legal-task-dialog.component.css']
})

export class LegalTaskCreationUpdatingDialogComponent {
    legalTask: LegalTask;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: LegalTask, private readonly legalTaskService: LegalTaskService,
                private readonly dialog: MatDialog) {
        this.title = data ? 'Actualización de Tarea Legal' : 'Creación de Tarea Legal';
        this.legalTask = data || {id: undefined, title: undefined};
    }

    create(): void {
        this.legalTaskService
            .create(this.legalTask)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        this.legalTaskService
            .update(this.legalTask.id, this.legalTask)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return this.legalTask.id === undefined;
    }

    invalid(): boolean {
        return this.check(this.legalTask.title);
    }

    check(attr: string): boolean {
        return attr === undefined || null || attr === '';
    }
}
