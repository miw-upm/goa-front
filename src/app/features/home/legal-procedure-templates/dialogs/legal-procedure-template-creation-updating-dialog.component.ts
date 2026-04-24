import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
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
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatNativeDateModule} from '@angular/material/core';

import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {InputData} from '@shared/ui/inputs/input-data.component';
import {FormListComponent} from '@shared/ui/inputs/forms/form-list.component';
import {SharedLegalTaskService} from '@features/shared/services/shared-legal-task.service';
import {SearchByLegalTaskComponent} from '@features/shared/ui/search-by-legal-task.component';
import {LegalProcedureTemplate} from '../models/legal-procedure-template.model';
import {LegalTask} from '@features/shared/models/legal-task.model';
import {LegalProcedureTemplateService} from '../legal-procedure-template.service';


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
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatNativeDateModule,
        SearchByLegalTaskComponent,
        FormFieldComponent,
        InputData,
        FormListComponent
    ],
    templateUrl: 'legal-procedure-template-creation-updating-dialog.component.html',
    styleUrls: ['legal-procedure-template-dialog.component.css']
})

export class LegalProcedureTemplateCreationUpdatingDialogComponent {
    template: LegalProcedureTemplate;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: LegalProcedureTemplate, private readonly legalProcedureTemplateService: LegalProcedureTemplateService,
                private readonly dialog: MatDialog, private readonly sharedLegalTaskService: SharedLegalTaskService) {
        this.title = data ? 'Actualizar Plantilla De Procedimiento Legal' : 'Crear Plantilla De Procedimiento Legal';
        this.template = {
            id: undefined,
            title: undefined,
            legalTasks: [],
            budget: undefined,
            ...(data || {})
        };
    }

    create(): void {
        this.legalProcedureTemplateService
            .create(this.template)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        this.legalProcedureTemplateService
            .update(this.template.id, this.template)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return this.template.id === undefined;
    }

    formInvalid(legalTasks: LegalTask[], ...controls: NgModel[]): boolean {
        return !legalTasks?.length || controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    addTask(value: LegalTask): void {
        const taskTitle = value?.title?.trim();
        if (taskTitle && !this.template.legalTasks.some(t => t.title === taskTitle)) {
            this.template.legalTasks.push({...value, title: taskTitle});
        }
    }

    addNewTask(value: string): void {
        const task = (value || '').trim();
        if (task && !this.template.legalTasks.some(t => t.title === task)) {
            this.sharedLegalTaskService.create({title: value}).subscribe(
                () => this.template.legalTasks.push({title: task})
            );
        }
    }

}