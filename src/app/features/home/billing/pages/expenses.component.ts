import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {Expense} from '../models/expense.model';
import {ExpenseService} from '../expense.service';
import {ExpenseCreationDialogComponent} from '../dialogs/expense-creation-dialog.component';

@Component({
    standalone: true,
    selector: 'app-expenses',
    imports: [CrudComponent],
    templateUrl: 'expenses.component.html'
})
export class ExpensesComponent {
    title = 'Gastos';
    expenses = of([] as Expense[]);
    expense: Observable<Expense>;

    constructor(private readonly dialog: MatDialog, private readonly expenseService: ExpenseService) {
    }

    search(): void {
        // TODO: Add search criteria
        this.expenses = this.expenseService.search();
    }

    create(): void {
        this.dialog.open(ExpenseCreationDialogComponent, {width: '600px'})
            .afterClosed();
    }

    read(expense: Expense): void {
        this.expense = this.expenseService.read(expense.id);
    }
}
