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
import {FormSelectComponent} from '@shared/ui/inputs/forms/select.component';
import {SharedUserService} from '@features/shared/services/shared-user.service';
import {EngagementLetterService} from '../../engagement-letter/engagement-letter.service';
import {EngagementLetterSearch} from '../../engagement-letter/models/engagement-letter-search.model';
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
        FormFieldComponent,
        FormSelectComponent,
    ],
    providers: [EngagementLetterService],
    templateUrl: 'income-creation-dialog.component.html',
    styleUrls: ['income-creation-dialog.component.css']
})
export class IncomeCreationDialogComponent {
    engagementIds: Observable<string[]>;
    userIds: Observable<string[]>;
    income: Income = {
        engagementId: undefined,
        userId: undefined,
        amount: undefined,
        date: undefined,
    };

    constructor(
        private readonly incomeService: IncomeService,
        private readonly engagementLetterService: EngagementLetterService,
        private readonly sharedUserService: SharedUserService,
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

        this.userIds = this.sharedUserService.searchUsers('')
            .pipe(map(users => users
                .map((user: any) => user.id ?? user.mobile)
                .filter((userId): userId is string => !!userId)));
    }

    create(): void {
        if (!this.canCreate()) {
            return;
        }
        this.incomeService
            .create(this.income)
            .subscribe(() => this.dialog.closeAll());
    }

    canCreate(): boolean {
        return this.hasEngagementId()
            && this.hasUserId()
            && this.hasValidAmount()
            && this.hasValidDate();
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
        if (!this.income.date) {
            return false;
        }
        return !Number.isNaN(Date.parse(this.income.date));
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }
}

