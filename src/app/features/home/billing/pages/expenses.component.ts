import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";

import {Expense} from '../models/expense.model';
import {ExpenseSearch} from '../models/expense-search.model';
import {ExpenseService} from '../expense.service';
import {ExpenseCreationDialogComponent} from '../dialogs/expense-creation-dialog.component';
import {FilterDateComponent} from "../../../../shared/ui/inputs/filters/filter-date.component";
import {FilterInputComponent} from "../../../../shared/ui/inputs/filters/filter-input.component";
import {CrudComponent} from "@shared/ui/crud/crud.component";

@Component({
    standalone: true,
    selector: 'app-expenses',
    imports: [FilterDateComponent, FilterInputComponent, CrudComponent],
    templateUrl: 'expenses.component.html'
})
export class ExpensesComponent {
    private static readonly SNACK_SUCCESS_DURATION = 3000;
    title = 'Gastos';
    expenses = of([] as Expense[]);
    expense: Observable<Expense>;
    criteria: ExpenseSearch = {};

    constructor(
        private readonly dialog: MatDialog,
        private readonly snackBar: MatSnackBar,
        private readonly expenseService: ExpenseService
    ) {

    }

    search(): void {
        if (this.criteria.engagementId && !this.isValidUuid(this.criteria.engagementId)) {
            this.snackBar.open('El ID de búsqueda no es un UUID válido.', '', {
                duration: ExpensesComponent.SNACK_SUCCESS_DURATION
            });
            return;
        }
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

    read(expense: Expense): void {
        this.expense = this.expenseService.read(expense.id);
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

    private isValidUuid(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}
