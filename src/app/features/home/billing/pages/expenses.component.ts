import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {of} from 'rxjs';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {Expense} from '../models/expense.model';
import {ExpenseSearch} from '../models/expense-search.model';
import {ExpenseService} from '../expense.service';
import {ExpenseCreationDialogComponent} from '../dialogs/expense-creation-dialog.component';
import {FilterDateComponent} from "../../../../shared/ui/inputs/filter-date.component";

@Component({
    standalone: true,
    selector: 'app-expenses',
    imports: [CrudComponent, FilterDateComponent],
    templateUrl: 'expenses.component.html'
})
export class ExpensesComponent {
    title = 'Gastos';
    expenses = of([] as Expense[]);
    criteria: ExpenseSearch = {};

    constructor(private readonly dialog: MatDialog, private readonly expenseService: ExpenseService) {
    }

    search(): void {
        if (this.criteria.date) {
            const date = new Date(this.criteria.date);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            this.criteria.date = `${year}-${month}-${day}`;
        }
        this.expenses = this.expenseService.search(this.criteria);
    }

    create(): void {
        this.dialog.open(ExpenseCreationDialogComponent, {width: '600px'})
            .afterClosed()
            .subscribe(() => this.search());
    }

    update(expense: Expense): void {
        if (!expense.id) {
            return;
        }

        this.dialog.open(ExpenseCreationDialogComponent, {
            width: '600px',
            data: expense
        }).afterClosed()
            .subscribe(() => this.search());
    }
}
