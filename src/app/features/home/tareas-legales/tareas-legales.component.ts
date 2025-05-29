import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {of} from 'rxjs';

import {CrudComponent} from '@common/components/crud.component';
import {FilterInputComponent} from "@common/components/filter-input.component";
import {TareaLegalCreationUpdatingDialogComponent} from './tarea-legal-creation-updating-dialog.component';
import {TareaLegalSearch} from "./tarea-legal-search.model";
import {TareaLegalService} from "./tarea-legal.service";
import {TareaLegal} from "./tarea-legal.model";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'tareas-legales.component.html'
})
export class TareasLegalesComponent {
    tareaLegalSearch: TareaLegalSearch;
    title = "Tareas Legales";
    tareasLegales = of([]);

    constructor(private readonly dialog: MatDialog, private readonly tareaLegalService: TareaLegalService) {
        this.resetSearch();
    }

    search(): void {
        this.tareasLegales = this.tareaLegalService.search(this.tareaLegalSearch);
    }

    resetSearch(): void {
        this.tareaLegalSearch = {};
    }

    create(): void {
        this.dialog
            .open(TareaLegalCreationUpdatingDialogComponent);
    }

    update(tareaLegal: TareaLegal): void {
        this.dialog.open(TareaLegalCreationUpdatingDialogComponent, {data: tareaLegal})
            .afterClosed()
            .subscribe(() => this.search());
    }

    delete(tareaLegal: TareaLegal): void {
        this.tareaLegalService.delete(tareaLegal.id).subscribe(() => this.search());
    }

}
