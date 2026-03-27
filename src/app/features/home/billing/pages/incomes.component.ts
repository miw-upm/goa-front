import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {catchError, map, of} from 'rxjs';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {IncomeCreationDialogComponent} from '../dialogs/income-creation-dialog.component';
import {IncomeService} from '../income.service';
import {Income} from '../models/income.model';
import {IncomeSearch} from '../models/income-search.model';

@Component({
    standalone: true,
    selector: 'app-incomes',
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'incomes.component.html'
})
export class IncomesComponent {
    title = 'Ingresos';
    incomes = of([] as Income[]);
    criteria: IncomeSearch;

    constructor(private readonly dialog: MatDialog, private readonly incomeService: IncomeService) {
        this.resetSearch();
    }

    resetSearch(): void {
        this.criteria = {};
    }

    search(): void {
        this.incomes = this.incomeService.search(this.criteria)
            .pipe(
                map(incomes => [...incomes].sort((a, b) => b.date.localeCompare(a.date))),
                catchError(() => of([] as Income[]))
            );
    }

    create(): void {
        this.dialog.open(IncomeCreationDialogComponent, {width: '600px'})
            .afterClosed();
    }
}
