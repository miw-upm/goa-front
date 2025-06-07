import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

import {LegalTaskService} from "../legal-task.service";
import {LegalTask} from "../models/legal-task.model";

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
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
