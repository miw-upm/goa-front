import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';
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
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {SearchByTareaLegalComponent} from "@shared/components/search-by-tarea-legal.component";
import {MatList, MatListItem} from "@angular/material/list";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {LegalTaskService} from "../../tareas-legales/legal-task.service";

@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput, MatDialogActions,
        MatDialogClose, MatButton, NgIf, DatePipe, MatCheckbox, MatIcon, MatSuffix, SearchByTareaLegalComponent,
        MatList, MatListItem, MatIconButton, MatDatepickerToggle, MatDatepicker, MatDatepickerInput, MatNativeDateModule],
    templateUrl: 'legal-procedure-creation-updating-dialog.component.html',
    styleUrls: ['legal-procedure-dialog.component.css']
})

export class LegalProcedureCreationUpdatingDialogComponent {
    legalProcedure: LegalProcedureTemplate;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: LegalProcedureTemplate, private readonly procedimientoLegalService: LegalProcedureTemplateService,
                private readonly dialog: MatDialog, private readonly tareaLegalService: LegalTaskService) {
        this.title = data ? 'Actualizar Procedimiento Legal' : 'Crear Procedimiento Legal';
        this.legalProcedure = {
            id: undefined,
            title: undefined,
            startDate: data?.startDate ? new Date(data.startDate) : undefined,
            legalTasks: [],
            budget: undefined,
            vatIncluded: false,
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

    addTarea(value: string): void {
        const tarea = (value || '').trim();
        if (tarea) {
            this.legalProcedure.legalTasks.push(tarea);
        }
    }

    addNewTarea(value: string): void {
        const tarea = (value || '').trim();
        if (tarea) {
            this.legalProcedure.legalTasks.push(tarea);
            this.tareaLegalService.create({title: value}).subscribe();
        }
    }

    removeTareaLegal(tarea: string): void {
        const index = this.legalProcedure.legalTasks?.indexOf(tarea);
        if (index !== undefined && index >= 0) {
            this.legalProcedure.legalTasks.splice(index, 1);
        }
    }
}