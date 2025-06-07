import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";

import {LegalTaskService} from "../../legal-taks/legal-task.service";
import {LegalProcedure} from "../models/legal-procedure.model";

@Component({
    standalone: true,
    selector: 'app-legal-procedure-edit-dialog',
    templateUrl: './legal-procedure-edit-dialog.component.html',
    styleUrls: ['./legal-procedure-edit-dialog.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatDialogModule,
        MatListModule,
        MatTooltipModule,
    ]
})
export class LegalProcedureEditDialogComponent {
    procedure: LegalProcedure;

    newTask: string = '';


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, private readonly legalTaskService: LegalTaskService,
        private readonly dialogRef: MatDialogRef<LegalProcedureEditDialogComponent>
    ) {
        this.procedure = {
            ...data,
            legalTasks: [...(data.legalTasks ?? [])],
        };
    }

    save(): void {
        this.dialogRef.close(this.procedure);
    }

    cancel(): void {
        this.dialogRef.close();
    }

    addTask(): void {
        const task = (this.newTask || '').trim();
        if (task && !this.procedure.legalTasks.some(t => t === task)) {
            this.legalTaskService.create({title: task}).subscribe(
                () => this.procedure.legalTasks.push(task)
            );
        }
        this.newTask = '';
    }

    removeTask(task: string): void {
        this.procedure.legalTasks = this.procedure.legalTasks.filter(t => t !== task);
    }
}
