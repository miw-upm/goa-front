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
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {LegalProcedureTemplate} from "../legal-procedure-template.model";
import {LegalProcedureTemplateService} from "../legal-procedure-template.service";
import {MatIcon} from "@angular/material/icon";
import {SearchByTareaLegalComponent} from "@shared/components/search-by-tarea-legal.component";
import {MatList, MatListItem} from "@angular/material/list";
import {MatNativeDateModule} from "@angular/material/core";
import {LegalTaskService} from "../../tareas-legales/legal-task.service";
import {LegalTask} from "../../tareas-legales/legal-task.model";

@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput, MatDialogActions,
        MatDialogClose, MatButton, NgIf, MatIcon, MatSuffix, SearchByTareaLegalComponent,
        MatList, MatListItem, MatIconButton, MatNativeDateModule],
    templateUrl: 'legal-procedure-template-creation-updating-dialog.component.html',
    styleUrls: ['legal-procedure-template-dialog.component.css']
})

export class LegalProcedureTemplateCreationUpdatingDialogComponent {
    legalProcedure: LegalProcedureTemplate;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: LegalProcedureTemplate, private readonly procedimientoLegalService: LegalProcedureTemplateService,
                private readonly dialog: MatDialog, private readonly tareaLegalService: LegalTaskService) {
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

    addTask(value: string): void {
        const task = (value || '').trim();
        if (task && !this.legalProcedure.legalTasks.some(t => t.title === task)) {
            this.legalProcedure.legalTasks.push({title: task});
        }
    }

    addNewTask(value: string): void {
        const task = (value || '').trim();
        if (task && !this.legalProcedure.legalTasks.some(t => t.title === task)) {
            this.tareaLegalService.create({title: value}).subscribe(
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
}