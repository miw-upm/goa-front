import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {CrudComponent} from '@common/components/crud/crud.component';
import {FilterInputComponent} from "@common/components/inputs/filter-input.component";
import {LegalTaskCreationUpdatingDialogComponent} from '../components/legal-task-creation-updating-dialog.component';
import {LegalTaskSearch} from "../models/legal-task-search.model";
import {LegalTaskService} from "../legal-task.service";
import {LegalTask} from "../models/legal-task.model";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'legal-tasks.component.html'
})
export class LegalTasksComponent {
    legalTaskSearch: LegalTaskSearch;
    title = "Tareas Legales";
    legalTasks = of([]);
    task: Observable<LegalTask>;

    constructor(private readonly dialog: MatDialog, private readonly legalTaskService: LegalTaskService) {
        this.resetSearch();
    }

    search(): void {
        this.legalTasks = this.legalTaskService.search(this.legalTaskSearch);
    }

    resetSearch(): void {
        this.legalTaskSearch = {};
    }

    create(): void {
        this.dialog
            .open(LegalTaskCreationUpdatingDialogComponent);
    }

    update(task: LegalTask): void {
        this.dialog.open(LegalTaskCreationUpdatingDialogComponent, {data: task})
            .afterClosed()
            .subscribe(() => this.search());
    }

    delete(task: LegalTask): void {
        this.legalTaskService.delete(task.id).subscribe(() => this.search());
    }

    read($event: any) {
        this.task = this.legalTaskService.read($event.id);
    }
}
