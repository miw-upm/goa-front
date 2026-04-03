import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {catchError, map, Observable, of} from 'rxjs';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterDateComponent} from '@shared/ui/inputs/filter-date.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {IncomeCreationDialogComponent} from '../dialogs/income-creation-dialog.component';
import {IncomeService} from '../income.service';
import {Income} from '../models/income.model';
import {IncomeSearch} from '../models/income-search.model';

@Component({
    standalone: true,
    selector: 'app-incomes',
    imports: [FormsModule, CrudComponent, FilterDateComponent, FilterInputComponent],
    templateUrl: 'incomes.component.html'
})
export class IncomesComponent {
    title = 'Ingresos';
    incomes = of([] as Income[]);
    income: Observable<Income>;
    criteria: IncomeSearch;

    constructor(private readonly dialog: MatDialog, private readonly incomeService: IncomeService) {
        this.resetSearch();
    }

    resetSearch(): void {
        this.criteria = {};
    }

    search(): void {
        if (this.criteria.date) {
            const date = new Date(this.criteria.date);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            this.criteria.date = `${year}-${month}-${day}`;
        }

        this.incomes = this.incomeService.search(this.criteria)
            .pipe(
                map(incomes => [...incomes].sort((a, b) => b.date.localeCompare(a.date))),
                catchError(() => of([] as Income[]))
            );
    }

    create(): void {
        this.dialog.open(IncomeCreationDialogComponent, {width: '600px'})
            .afterClosed()
            .subscribe(() => this.search());
    }

    read(income: Income): void {
        this.income = this.incomeService.read(income.id);
    }

    update(income: Income): void {
        if (!income.id) {
            return;
        }

        this.dialog.open(IncomeCreationDialogComponent, {
            width: '600px',
            data: income
        }).afterClosed()
            .subscribe(() => this.search());
    }
}
