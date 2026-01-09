import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from "@angular/material/list";

import {SharedLegalTaskService} from "../../../common/services/shared-legal-task.service";
import {LegalProcedure} from "../models/legal-procedure.model";
import {FormListComponent} from "@shared/ui/inputs/forms/list.component";
import {InputData} from "@shared/ui/inputs/input-data.component";
import {FormFieldComponent} from "@shared/ui/inputs/forms/field.component";
import {AppDateFieldComponent} from "@shared/ui/inputs/forms/data.component";
import {SearchByLegalTaskComponent} from "../../../common/components/search-by-legal-task.component";
import {LegalTask} from "../../../common/models/legal-task.model";

@Component({
    standalone: true,
    selector: 'app-legal-procedure-edit-dialog',
    providers: [SharedLegalTaskService],
    templateUrl: './legal-procedure-edit-dialog.component.html',
    styleUrls: ['./legal-procedure-edit-dialog.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDialogModule,
        MatListModule,
        FormListComponent,
        FormFieldComponent,
        AppDateFieldComponent,
        SearchByLegalTaskComponent,
        MatButton,
        InputData,
    ]
})
export class LegalProcedureEditDialogComponent {
    procedure: LegalProcedure;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, private readonly sharedLegalTaskService: SharedLegalTaskService,
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

    addTask(task: LegalTask): void {
        const taskTitle = task?.title?.trim();
        if (taskTitle && !this.procedure.legalTasks.some(t => t === taskTitle)) {
            this.procedure.legalTasks.push(task.title);
        }
    }

    addNewTask(newTask: string): void {
        const task = (newTask || '').trim();
        if (task && !this.procedure.legalTasks.some(t => t === task)) {
            this.sharedLegalTaskService.create({title: task}).subscribe(
                () => this.procedure.legalTasks.push(task)
            );
        }
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }
}
