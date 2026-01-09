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
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatNativeDateModule} from "@angular/material/core";

import {SharedLegalTaskService} from "../../../common/services/shared-legal-task.service";
import {SearchByLegalTaskComponent} from "../../../common/ui/search-by-legal-task.component";
import {LegalProcedureTemplate} from "../../../common/models/legal-procedure-template.model";
import {LegalTask} from "../../../common/models/legal-task.model";
import {LegalProcedureTemplateService} from "../legal-procedure-template.service";
import {FormFieldComponent} from "@shared/ui/inputs/forms/field.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {InputData} from "@shared/ui/inputs/input-data.component";
import {FormListComponent} from "@shared/ui/inputs/forms/list.component";

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
    legalProcedure: LegalProcedureTemplate;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: LegalProcedureTemplate, private readonly procedimientoLegalService: LegalProcedureTemplateService,
                private readonly dialog: MatDialog, private readonly sharedLegalTaskService: SharedLegalTaskService) {
        this.title = data ? 'Actualizar Plantilla De Procedimiento Legal' : 'Crear Plantilla De Procedimiento Legal';
        this.legalProcedure = {
            id: undefined,
            title: undefined,
            legalTasks: [],
            budget: undefined,
            ...(data || {})
        };
    }

    create(): void {
        this.procedimientoLegalService
            .create(this.legalProcedure)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        this.procedimientoLegalService
            .update(this.legalProcedure.id, this.legalProcedure)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return this.legalProcedure.id === undefined;
    }


    invalid(): boolean {
        return this.check(this.legalProcedure.title);
    }

    check(attr: string | number | null | undefined): boolean {
        return (
            attr === undefined ||
            attr === null ||
            (typeof attr === 'string' && attr.trim() === '') ||
            (typeof attr === 'number' && isNaN(attr))
        );
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    addTask(value: LegalTask): void {
        const taskTitle = value?.title?.trim();
        if (taskTitle && !this.legalProcedure.legalTasks.some(t => t.title === taskTitle)) {
            this.legalProcedure.legalTasks.push({...value, title: taskTitle});
        }
    }

    addNewTask(value: string): void {
        const task = (value || '').trim();
        if (task && !this.legalProcedure.legalTasks.some(t => t.title === task)) {
            this.sharedLegalTaskService.create({title: value}).subscribe(
                () => this.legalProcedure.legalTasks.push({title: task})
            );
        }
    }

    removeLegalTask(task: LegalTask): void {
        const index = this.legalProcedure.legalTasks?.indexOf(task);
        if (index !== undefined && index >= 0) {
            this.legalProcedure.legalTasks.splice(index, 1);
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.legalProcedure.legalTasks, event.previousIndex, event.currentIndex);
    }

}