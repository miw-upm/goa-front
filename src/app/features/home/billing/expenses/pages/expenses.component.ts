import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {ExpenseCreationUpdatingDialogComponent} from '../dialogs/expense-creation-updating-dialog.component';
import {ExpenseFindCriteria} from '../models/expense-find-criteria.model';
import {Expense} from '../models/expense.model';
import {ExpenseService} from '../expense.service';
import {EXPENSES_COLUMNS} from './expenses-columns.config';
import {map} from "rxjs/operators";
import {FilterDateComponent} from "@shared/ui/inputs/filters/filter-date.component";
import {FilterInputComponent} from "@shared/ui/inputs/filters/filter-input.component";
import {TitleComponent} from "@shared/ui/title/title.component";
import {CrudComponent} from "@shared/ui/crud/crud.component";
import {AuthService} from "@core/auth/auth.service";
import {BillingPeriodService} from "../../shared/billing-period.service";

@Component({
    standalone: true,
    selector: 'app-expenses',
    imports: [
        FilterDateComponent,
        FilterInputComponent,
        TitleComponent,
        CrudComponent,
    ],
    templateUrl: 'expenses.component.html'
})
export class ExpensesComponent {
    deleteVisibility = false;
    expenses = of([] as Expense[]);
    expense: Observable<Expense>;
    criteria: ExpenseFindCriteria;
    columns = EXPENSES_COLUMNS;

    constructor(
        private readonly dialog: MatDialog,
        private readonly expenseService: ExpenseService,
        private readonly billingPeriodService: BillingPeriodService,
        auth: AuthService
    ) {
        this.deleteVisibility = auth.isAdmin();
        this.criteria = {
            fromDate: this.billingPeriodService.currentQuarterStartDate()
        };
    }

    search(): void {
        const criteria = {
            ...this.criteria,
            fromDate: this.billingPeriodService.formatDateValue(this.criteria.fromDate)
        };
        this.expenses = this.expenseService.search(criteria).pipe(
            map(expenses => expenses.map(expense => ({
                ...expense,
                total: expense.baseAmount
                    + expense.baseAmount * expense.vatRate / 100
                    - (expense.withholdingTax ?? 0)
            })))
        );
    }

    create(): void {
        this.dialog.open(ExpenseCreationUpdatingDialogComponent, {width: '720px'})
            .afterClosed()
            .subscribe((id?: string) => this.setEngagementIdAndSearch(id));
    }

    read(expense: Expense): void {
        if (expense.id) {
            this.expense = this.expenseService.read(expense.id);
        }
    }

    update(expense: Expense): void {
        this.dialog.open(ExpenseCreationUpdatingDialogComponent, {width: '720px', data: expense})
            .afterClosed()
            .subscribe((id?: string) => this.setEngagementIdAndSearch(id));
    }

    private setEngagementIdAndSearch(id: string | undefined): void {
        this.criteria.engagementId = id?.slice(0, 4);
        this.search();
    }
}
