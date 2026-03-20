import {Component} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormsModule, NgModel} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import {FormFieldComponent} from '@shared/ui/inputs/forms/field.component';
import {EngagementLetterService} from '../../engagement-letter/engagement-letter.service';
import {EngagementLetterSearch} from '../../engagement-letter/models/engagement-letter-search.model';
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
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        FormFieldComponent,
    ],
    providers: [EngagementLetterService],
    templateUrl: 'expense-creation-dialog.component.html',
    styleUrls: ['expense-creation-dialog.component.css']
})
export class ExpenseCreationDialogComponent {
    engagementIds: Observable<string[]>;
    expense: Expense = {
        engagementId: undefined,
        amount: undefined,
        date: undefined,
        description: undefined,
    };

    constructor(
        private readonly expenseService: ExpenseService,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly dialog: MatDialog
    ) {
        const criteria: EngagementLetterSearch = {
            opened: true,
            owner: '',
            legalProcedureTitle: ''
        };
        this.engagementIds = this.engagementLetterService.search(criteria)
            .pipe(map(engagements => engagements
                .map(engagement => engagement.id)
                .filter((id): id is string => !!id)));
    }

    create(): void {
        if (!this.canCreate()) {
            return;
        }
        this.expenseService
            .create(this.expense)
            .subscribe(() => this.dialog.closeAll());
    }

    canCreate(): boolean {
        return this.hasEngagementId()
            && this.hasValidAmount()
            && this.hasValidDate()
            && this.hasDescription();
    }

    private hasEngagementId(): boolean {
        return !!this.expense.engagementId;
    }

    private hasValidAmount(): boolean {
        const amount = Number(this.expense.amount);
        return Number.isFinite(amount) && amount > 0;
    }

    private hasValidDate(): boolean {
        if (!this.expense.date) {
            return false;
        }
        return !Number.isNaN(Date.parse(this.expense.date));
    }

    private hasDescription(): boolean {
        return !!this.expense.description?.trim();
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }
}
