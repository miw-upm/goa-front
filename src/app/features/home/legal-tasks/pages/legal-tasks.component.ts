import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {LegalTask} from '@features/shared/models/legal-task.model';
import {LegalTaskCreationUpdatingDialogComponent} from '../dialogs/legal-task-creation-updating-dialog.component';
import {LegalTaskService} from '../legal-task.service';
import {AuthService} from "@core/auth/auth.service";
import {TitleComponent} from "@shared/ui/title/title.component";
import {Crud2Component} from "@shared/ui/crud2/crud2.component";
import {LEGAL_TASKS_COLUMNS} from "./legal-tasks-columns.config";

@Component({
    standalone: true,
    imports: [FormsModule, FilterInputComponent, TitleComponent, Crud2Component],
    templateUrl: 'legal-tasks.component.html'
})
export class LegalTasksComponent {
    deleteVisibility: boolean = false;
    searchTitle: string;
    tasks = of([]);
    task: Observable<LegalTask>;
    columns = LEGAL_TASKS_COLUMNS

    constructor(private readonly dialog: MatDialog, private readonly legalTaskService: LegalTaskService, auth: AuthService) {
        this.deleteVisibility = auth.isAdmin();
        this.resetSearch();
    }

    search(): void {
        this.tasks = this.legalTaskService.search(this.searchTitle);
    }

    resetSearch(): void {
        this.searchTitle = undefined;
    }

    create(): void {
        this.dialog
            .open(LegalTaskCreationUpdatingDialogComponent)
            .afterClosed()
            .subscribe(() => {
                this.search();
            });
    }

    update(task: LegalTask): void {
        this.dialog.open(LegalTaskCreationUpdatingDialogComponent, {data: task})
            .afterClosed()
            .subscribe(() => this.search());
    }

    delete(task: LegalTask): void {
        this.legalTaskService.delete(task.id).subscribe(() => this.search());
    }

    read(task: LegalTask) {
        this.task = this.legalTaskService.read(task.id);
    }
}
