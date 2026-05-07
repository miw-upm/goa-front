import {Component, Inject, Optional} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormsModule, NgModel} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';

import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {EngagementLetterService} from '../../engagement-letter/engagement-letter.service';
import {EngagementLetterFindCriteria} from '../../engagement-letter/models/engagement-letter-find-criteria.model';
import {ExpenseService} from '../expense.service';
import {Expense} from '../models/expense.model';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        AsyncPipe,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        AppDateFieldComponent,
        FormFieldComponent,
    ],
    providers: [EngagementLetterService],
    templateUrl: 'expense-creation-dialog.component.html'
})
export class ExpenseCreationDialogComponent {
    title: string;
    engagementIds: Observable<string[]>;
    expense: Expense = {
        id: undefined,
        engagementId: undefined,
        amount: undefined,
        date: undefined,
        description: undefined,
    };
    private expenseDateValue: Date | null = null;

    constructor(
        private readonly expenseService: ExpenseService,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly dialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) data?: Expense
    ) {
        this.title = data?.id ? 'Actualizacion de Gasto' : 'Creacion de Gasto';
        this.expense = {
            id: data?.id,
            engagementId: data?.engagementId,
            amount: data?.amount,
            date: data?.date,
            description: data?.description,
        };
        this.expenseDate = data?.date;

        const criteria: EngagementLetterFindCriteria = {
            opened: true,
            client: '',
            legalProcedureTitle: ''
        };
        this.engagementIds = this.engagementLetterService.search(criteria)
            .pipe(map(engagements => engagements
                .map(engagement => engagement.id)
                .filter((id): id is string => !!id)));
    }

    get expenseDate(): Date | null {
        return this.expenseDateValue;
    }

    set expenseDate(value: Date | string | null | undefined) {
        const parsedDate = value instanceof Date ? value : this.parseDate(value);
        this.expenseDateValue = parsedDate;
        this.expense.date = parsedDate ? this.formatDate(parsedDate) : undefined;
    }

    create(): void {
        if (!this.isCreate() || !this.canSubmit()) {
            return;
        }
        this.expenseService
            .create(this.expense)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        if (this.isCreate() || !this.expense.id || !this.canSubmit()) {
            return;
        }

        const {id, ...expense} = this.expense;
        this.expenseService
            .update(id, expense)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return !this.expense.id;
    }

    canSubmit(): boolean {
        return this.hasEngagementId()
            && this.hasValidAmount()
            && this.hasValidDate()
            && this.hasDescription();
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    private hasEngagementId(): boolean {
        return !!this.expense.engagementId;
    }

    private hasValidAmount(): boolean {
        const amount = Number(this.expense.amount);
        return Number.isFinite(amount) && amount > 0;
    }

    private hasValidDate(): boolean {
        return this.expenseDateValue !== null || this.parseDate(this.expense.date) !== null;
    }

    private hasDescription(): boolean {
        return !!this.expense.description?.trim();
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
