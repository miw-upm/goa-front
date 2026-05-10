import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';

import {FormListComponent} from '@shared/ui/inputs/forms/form-list.component';
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
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatSlideToggle,
        FormListComponent,
        FormFieldComponent,
        AppDateFieldComponent,
        SearchByLegalTaskComponent,
        MatButton,
        MatFormField,
        MatLabel,
        MatInput,
        MatIcon,
    ]
})
export class LegalProcedureEditDialogComponent {
    procedure: LegalProcedure;
    newTaskValue = '';

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

    addNewTaskFromInput(): void {
        this.addNewTask(this.newTaskValue);
        this.newTaskValue = '';
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid);
    }
}