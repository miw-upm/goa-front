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
import {ProcedimientoLegal} from "../procedimiento-legal.model";
import {ProcedimientoLegalService} from "../procedimiento-legal.service";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {SearchByTareaLegalComponent} from "@shared/components/search-by-tarea-legal.component";
import {MatList, MatListItem} from "@angular/material/list";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {TareaLegalService} from "../../tareas-legales/tarea-legal.service";

@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput, MatDialogActions,
        MatDialogClose, MatButton, NgIf, DatePipe, MatCheckbox, MatIcon, MatSuffix, SearchByTareaLegalComponent,
        MatList, MatListItem, MatIconButton, MatDatepickerToggle, MatDatepicker, MatDatepickerInput, MatNativeDateModule],
    templateUrl: 'procedimiento-legal-creation-updating-dialog.component.html',
    styleUrls: ['procedimiento-legal-dialog.component.css']
})

export class ProcedimientoLegalCreationUpdatingDialogComponent {
    procedimientoLegal: ProcedimientoLegal;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: ProcedimientoLegal, private readonly procedimientoLegalService: ProcedimientoLegalService,
                private readonly dialog: MatDialog, private readonly tareaLegalService: TareaLegalService) {
        this.title = data ? 'Actualizar Procedimiento Legal' : 'Crear Procedimiento Legal';
        this.procedimientoLegal = {
            id: undefined,
            titulo: undefined,
            fechaInicio: data?.fechaInicio ? new Date(data.fechaInicio) : new Date(),
            tareasLegales: [],
            presupuesto: undefined,
            ivaIncluido: false,
            ...(data || {})
        };
    }

    create(): void {
        this.procedimientoLegalService
            .create(this.procedimientoLegal)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        this.procedimientoLegalService
            .update(this.procedimientoLegal.id, this.procedimientoLegal)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return this.procedimientoLegal.id === undefined;
    }

    invalid(): boolean {
        return this.check(this.procedimientoLegal.titulo) &&
            this.check(this.procedimientoLegal.presupuesto);
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
            this.procedimientoLegal.tareasLegales.push(tarea);
        }
    }

    addNewTarea(value: string): void {
        const tarea = (value || '').trim();
        if (tarea) {
            this.procedimientoLegal.tareasLegales.push(tarea);
            this.tareaLegalService.create({titulo: value}).subscribe();
        }
    }

    removeTareaLegal(tarea: string): void {
        const index = this.procedimientoLegal.tareasLegales?.indexOf(tarea);
        if (index !== undefined && index >= 0) {
            this.procedimientoLegal.tareasLegales.splice(index, 1);
        }
    }
}