import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';

import {FormListComponent} from '@shared/ui/inputs/forms/form-list.component';
import {InputData} from '@shared/ui/inputs/input-data.component';
import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {SharedLegalTaskService} from '@features/shared/services/shared-legal-task.service';
import {SearchByLegalTaskComponent} from '@features/shared/ui/search-by-legal-task.component';
import {LegalTask} from '@features/shared/models/legal-task.model';
import {LegalProcedure} from '../models/legal-procedure.model';

@Component({
    standalone: true,
    selector: 'app-legal-procedure-edit-dialog',
    providers: [SharedLegalTaskService],
    templateUrl: './legal-procedure-edit-dialog.component.html',
    styleUrls: ['./legal-procedure-edit-dialog.component.css'],
    imports: [
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
        @Inject(MAT_DIALOG_DATA) data: LegalProcedure,
        private readonly sharedLegalTaskService: SharedLegalTaskService,
        private readonly dialogRef: MatDialogRef<LegalProcedureEditDialogComponent>
    ) {
        this.procedure = {
            ...data,
            legalTasks: [...(data.legalTasks ?? [])]
        };
    }

    save(): void {
        this.dialogRef.close(this.procedure);
    }

    cancel(): void {
        this.dialogRef.close();
    }

    addTask(task: LegalTask): void {
        const title = task?.title?.trim();
        if (title && !this.procedure.legalTasks.includes(title)) {
            this.procedure.legalTasks.push(title);
        }
    }

    addNewTask(value: string): void {
        const title = (value || '').trim();
        if (title && !this.procedure.legalTasks.includes(title)) {
            this.sharedLegalTaskService.create({title}).subscribe(
                () => this.procedure.legalTasks.push(title)
            );
        }
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid);
    }
}