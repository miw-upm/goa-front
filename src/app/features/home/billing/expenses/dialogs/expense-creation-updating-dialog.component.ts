import {Component, Inject, Optional} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {Observable} from 'rxjs';

import {EngagementLetter} from '../../../engagement-letter/models/engagement-letter.model';
import {ExpenseService} from '../expense.service';
import {Expense} from '../models/expense.model';
import {SupplierInfo} from '../models/supplier-info.model';
import {SearchBySupplierComponent} from '../ui/search-by-supplier.component';
import {SearchByEngagementLetterComponent} from "@features/shared/ui/search-by-engagement-letter.component";
import {AppDateFieldComponent} from "@shared/ui/inputs/forms/data.component";
import {FormFieldComponent} from "@shared/ui/inputs/forms/form-field.component";
import {FormSelectComponent} from "@shared/ui/inputs/forms/form-select.component";
import {SupplierCreationDialogComponent} from './supplier-creation-dialog.component';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIconButton,
        MatIcon,
        SearchByEngagementLetterComponent,
        SearchBySupplierComponent,
        AppDateFieldComponent,
        FormFieldComponent,
        FormSelectComponent,
    ],
    templateUrl: 'expense-creation-updating-dialog.component.html'
})
export class ExpenseCreationUpdatingDialogComponent {
    title: string;
    categories: Observable<string[]>;
    expense: Expense;
    selectedEngagementLetter?: EngagementLetter;
    private issueDateValue: Date | null = null;

    constructor(
        private readonly expenseService: ExpenseService,
        private readonly dialog: MatDialog,
        private readonly dialogRef: MatDialogRef<ExpenseCreationUpdatingDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) data?: Expense
    ) {
        this.title = data?.id ? 'Edicion de Gasto' : 'Creacion de Gasto';
        this.categories = this.expenseService.categories();
        this.expense = data ? {
            ...data,
            supplier: {...data.supplier}
        } : {
            issueDate: undefined,
            baseAmount: undefined,
            vatRate: undefined,
            supplier: undefined,
            taxCategory: undefined,
            description: '',
            withholdingTax: 0,
        };
        this.selectedEngagementLetter = data?.engagement;
        this.issueDate = data?.issueDate;
    }

    get issueDate(): Date | null {
        return this.issueDateValue;
    }

    set issueDate(value: Date | string | null | undefined) {
        const parsed = value instanceof Date ? value : this.parseDate(value);
        this.issueDateValue = parsed;
        this.expense.issueDate = parsed ? this.formatDate(parsed) : undefined;
    }

    isCreate(): boolean {
        return !this.expense.id;
    }

    setEngagementLetter(engagementLetter: EngagementLetter): void {
        this.selectedEngagementLetter = engagementLetter;
    }

    removeEngagementLetter(): void {
        this.selectedEngagementLetter = undefined;
    }

    setSupplier(supplier: SupplierInfo): void {
        this.expense.supplier = supplier;
    }

    createSupplier(): void {
        this.dialog.open(SupplierCreationDialogComponent, {width: '420px'})
            .afterClosed()
            .subscribe((supplier?: SupplierInfo) => {
                if (supplier) {
                    this.setSupplier(supplier);
                }
            });
    }

    removeSupplier(): void {
        this.expense.supplier = undefined;
    }

    create(): void {
        if (!this.isCreate() || !this.canSubmit()) {
            return;
        }
        this.expenseService.create(this.buildExpense()).subscribe(() => this.dialogRef.close());
    }

    update(): void {
        if (this.isCreate() || !this.expense.id || !this.canSubmit()) {
            return;
        }
        const {id, recordedAt, documentPath, ...expense} = this.buildExpense();
        this.expenseService.update(id, expense as Expense).subscribe(() => this.dialogRef.close());
    }

    canSubmit(): boolean {
        return !!this.expense.supplier?.name?.trim()
            && !!this.expense.supplier?.identity?.trim()
            && !!this.expense.taxCategory
            && !!this.expense.issueDate
            && this.isPositive(this.expense.baseAmount)
            && this.isPositive(this.expense.vatRate)
            && this.isPositiveOrZero(this.expense.withholdingTax);
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }

    private buildExpense(): Expense {
        return {
            ...this.expense,
            engagement: this.selectedEngagementLetter?.id
                ? {id: this.selectedEngagementLetter.id} as EngagementLetter
                : undefined,
            supplier: {...this.expense.supplier},
            withholdingTax: Number(this.expense.withholdingTax ?? 0)
        };
    }

    private isPositive(value: number | undefined): boolean {
        return Number.isFinite(Number(value)) && Number(value) > 0;
    }

    private isPositiveOrZero(value: number | undefined): boolean {
        return Number.isFinite(Number(value ?? 0)) && Number(value ?? 0) >= 0;
    }

    private parseDate(value: Date | string | null | undefined): Date | null {
        if (!value) {
            return null;
        }
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
