import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from "@shared/ui/inputs/filter-input.component";
import {LegalTask} from "../../../common/models/legal-task.model";
import {LegalTaskCreationUpdatingDialogComponent} from '../dialogs/legal-task-creation-updating-dialog.component';
import {LegalTaskSearch} from "../legal-task-search.model";
import {LegalTaskService} from "../legal-task.service";

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
