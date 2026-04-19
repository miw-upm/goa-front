import {AsyncPipe} from '@angular/common';
import {Component, Inject, Optional} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {forkJoin, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {EngagementLetterService} from '../../engagement-letter/engagement-letter.service';
import {EngagementLetterCriteria} from '../../engagement-letter/models/engagement-letter-criteria.model';
import {ExpenseService} from '../expense.service';
import {IncomeService} from '../income.service';
import {InvoiceService} from '../invoice.service';
import {Expense} from '../models/expense.model';
import {Income} from '../models/income.model';
import {InvoiceCreateRequest} from '../models/invoice-create-request.model';
import {Invoice} from '../models/invoice.model';

interface InvoiceSelectableExpense extends Expense {
    id: string;
}

interface InvoiceSelectableIncome extends Income {
    id: string;
}

@Component({
    standalone: true,
    imports: [
        FormsModule,
        AsyncPipe,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        AppDateFieldComponent
    ],
    providers: [EngagementLetterService],
    templateUrl: 'invoice-creation-dialog.component.html',
    styles: [
        `
            .full-width {
                width: 100%;
            }
        `
    ]
})
export class InvoiceCreationDialogComponent {
    title: string;
    engagementIds: Observable<string[]>;
    availableExpenses: Observable<InvoiceSelectableExpense[]> = of([]);
    availableIncomes: Observable<InvoiceSelectableIncome[]> = of([]);
    private invoiceDateValue: Date | null = null;
    private readonly currentInvoiceId?: string;

    invoice: InvoiceCreateRequest = {
        engagementId: undefined,
        date: undefined,
        expenseIds: [],
        incomeIds: []
    };

    get invoiceDate(): Date | null {
        return this.invoiceDateValue;
    }

    set invoiceDate(value: Date | string | null | undefined) {
        const parsedDate = value instanceof Date ? value : this.parseDate(value);
        this.invoiceDateValue = parsedDate;
        this.invoice.date = parsedDate ? this.formatDate(parsedDate) : undefined;
    }

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly expenseService: ExpenseService,
        private readonly incomeService: IncomeService,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly dialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) data?: Invoice
    ) {
        this.currentInvoiceId = data?.id;
        this.title = data?.id ? 'Actualizacion de Factura' : 'Creacion de Factura';
        this.invoice = {
            engagementId: data?.engagementId,
            date: data?.date,
            expenseIds: data?.expenses
                ?.map(expense => expense?.id)
                .filter((id): id is string => !!id) ?? [],
            incomeIds: data?.incomes
                ?.map(income => income?.id)
                .filter((id): id is string => !!id) ?? []
        };
        this.invoiceDate = data?.date;

        const criteria: EngagementLetterCriteria = {
            opened: true,
            client: '',
            legalProcedureTitle: ''
        };

        this.engagementIds = this.engagementLetterService.search(criteria)
            .pipe(map(engagements => engagements
                .map(engagement => engagement.id)
                .filter((id): id is string => !!id)));

        if (this.invoice.engagementId) {
            this.loadAvailableItems(this.invoice.engagementId);
        }
    }

    onEngagementChange(engagementId: string | undefined): void {
        this.invoice.engagementId = engagementId;
        this.invoice.expenseIds = [];
        this.invoice.incomeIds = [];

        if (!engagementId) {
            this.availableExpenses = of([]);
            this.availableIncomes = of([]);
            return;
        }

        this.loadAvailableItems(engagementId);
    }

    create(): void {
        if (!this.isCreate() || !this.canSubmit()) {
            return;
        }

        const request: InvoiceCreateRequest = {
            ...this.invoice,
            date: this.invoice.date ?? this.formatDate(new Date()),
            expenseIds: [...this.invoice.expenseIds],
            incomeIds: [...this.invoice.incomeIds]
        };

        this.invoiceService.create(request)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        if (this.isCreate() || !this.currentInvoiceId || !this.canSubmit()) {
            return;
        }

        const request: InvoiceCreateRequest = {
            ...this.invoice,
            date: this.invoice.date ?? this.formatDate(new Date()),
            expenseIds: [...this.invoice.expenseIds],
            incomeIds: [...this.invoice.incomeIds]
        };

        this.invoiceService.update(this.currentInvoiceId, request)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return !this.currentInvoiceId;
    }

    canSubmit(): boolean {
        return this.hasEngagementId() && this.hasAtLeastOneItem();
    }

    hasEngagementId(): boolean {
        return !!this.invoice.engagementId;
    }

    hasAtLeastOneItem(): boolean {
        return this.invoice.expenseIds.length > 0 || this.invoice.incomeIds.length > 0;
    }

    expenseLabel(expense: InvoiceSelectableExpense): string {
        return `${expense.description} | ${expense.amount} | ${expense.date} | ${expense.id}`;
    }

    incomeLabel(income: InvoiceSelectableIncome): string {
        return `${income.userId} | ${income.amount} | ${income.date} | ${income.id}`;
    }

    private loadAvailableItems(engagementId: string): void {
        const invoices$ = this.invoiceService.search({engagementId});
        const expenses$ = this.expenseService.search({engagementId});
        const incomes$ = this.incomeService.search({engagementId});

        this.availableExpenses = forkJoin([expenses$, invoices$])
            .pipe(map(([expenses, invoices]) => this.filterAvailableExpenses(expenses, invoices)));

        this.availableIncomes = forkJoin([incomes$, invoices$])
            .pipe(map(([incomes, invoices]) => this.filterAvailableIncomes(incomes, invoices)));
    }

    private filterAvailableExpenses(expenses: Expense[], invoices: Array<{ id?: string; expenses: Array<{ id?: string }> }>): InvoiceSelectableExpense[] {
        const assignedExpenseIds = new Set(
            invoices
                .filter(invoice => invoice.id !== this.currentInvoiceId)
                .flatMap(invoice => invoice.expenses)
                .map(expense => expense?.id)
                .filter((id): id is string => !!id)
        );

        return expenses.filter((expense): expense is InvoiceSelectableExpense => !!expense.id && !assignedExpenseIds.has(expense.id));
    }

    private filterAvailableIncomes(incomes: Income[], invoices: Array<{ id?: string; incomes: Array<{ id?: string }> }>): InvoiceSelectableIncome[] {
        const assignedIncomeIds = new Set(
            invoices
                .filter(invoice => invoice.id !== this.currentInvoiceId)
                .flatMap(invoice => invoice.incomes)
                .map(income => income?.id)
                .filter((id): id is string => !!id)
        );

        return incomes.filter((income): income is InvoiceSelectableIncome => !!income.id && !assignedIncomeIds.has(income.id));
    }

    private parseDate(value: Date | string | null | undefined): Date | null {
        if (!value) {
            return null;
        }

        if (value instanceof Date) {
            return Number.isNaN(value.getTime()) ? null : value;
        }

        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (match) {
            const year = Number(match[1]);
            const month = Number(match[2]) - 1;
            const day = Number(match[3]);
            const date = new Date(year, month, day);
            return Number.isNaN(date.getTime()) ? null : date;
        }

        const parsedDate = new Date(value);
        return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
