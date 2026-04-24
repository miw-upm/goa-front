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
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {FormFieldComponent} from '@shared/ui/inputs/forms/field.component';
import {FormSelectComponent} from '@shared/ui/inputs/forms/select.component';
import {SharedUserService} from '@features/shared/services/shared-user.service';
import {EngagementLetterService} from '../../engagement-letter/engagement-letter.service';
import {EngagementLetterFindCriteria} from '../../engagement-letter/models/engagement-letter-find-criteria.model';
import {IncomeService} from '../income.service';
import {Income} from '../models/income.model';

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
        AppDateFieldComponent,
        FormFieldComponent,
        FormSelectComponent,
    ],
    providers: [EngagementLetterService],
    templateUrl: 'income-creation-dialog.component.html',
    styleUrls: ['income-creation-dialog.component.css']
})
export class IncomeCreationDialogComponent {
    title: string;
    engagementIds: Observable<string[]>;
    userIds: Observable<string[]>;
    income: Income = {
        id: undefined,
        engagementId: undefined,
        userId: undefined,
        amount: undefined,
        date: undefined,
    };
    private incomeDateValue: Date | null = null;

    constructor(
        private readonly incomeService: IncomeService,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly sharedUserService: SharedUserService,
        private readonly dialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) data?: Income
    ) {
        this.title = data?.id ? 'Actualizacion de Ingreso' : 'Creacion de Ingreso';
        this.income = {
            id: data?.id,
            engagementId: data?.engagementId,
            userId: data?.userId,
            amount: data?.amount,
            date: data?.date,
        };
        this.incomeDate = data?.date;

        const criteria: EngagementLetterFindCriteria = {
            opened: true,
            client: '',
            legalProcedureTitle: ''
        };
        this.engagementIds = this.engagementLetterService.search(criteria)
            .pipe(map(engagements => engagements
                .map(engagement => engagement.id)
                .filter((id): id is string => !!id)));

        this.userIds = this.sharedUserService.searchUsers('')
            .pipe(map(users => this.buildUserIds(users)));
    }

    get incomeDate(): Date | null {
        return this.incomeDateValue;
    }

    set incomeDate(value: Date | string | null | undefined) {
        const parsedDate = value instanceof Date ? value : this.parseDate(value);
        this.incomeDateValue = parsedDate;
        this.income.date = parsedDate ? this.formatDate(parsedDate) : undefined;
    }

    create(): void {
        if (!this.isCreate() || !this.canSubmit()) {
            return;
        }
        this.incomeService
            .create(this.income)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        if (this.isCreate() || !this.income.id || !this.canSubmit()) {
            return;
        }

        const {id, ...income} = this.income;
        this.incomeService
            .update(id, income)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return !this.income.id;
    }

    canSubmit(): boolean {
        return this.hasEngagementId()
            && this.hasUserId()
            && this.hasValidAmount()
            && this.hasValidDate();
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    private hasEngagementId(): boolean {
        return !!this.income.engagementId;
    }

    private hasUserId(): boolean {
        return !!this.income.userId?.trim();
    }

    private hasValidAmount(): boolean {
        const amount = Number(this.income.amount);
        return Number.isFinite(amount) && amount > 0;
    }

    private hasValidDate(): boolean {
        return this.incomeDateValue !== null || this.parseDate(this.income.date) !== null;
    }

    private buildUserIds(users: Array<{ id?: string; mobile?: string }>): string[] {
        const userIds = users
            .map(user => user.id ?? user.mobile)
            .filter((userId): userId is string => !!userId);

        if (this.income.userId?.trim() && !userIds.includes(this.income.userId)) {
            return [this.income.userId, ...userIds];
        }

        return userIds;
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

