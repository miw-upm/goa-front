import {Component, Inject, Optional} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {of} from 'rxjs';

import {EngagementLetter} from '../../../engagement-letter/models/engagement-letter.model';
import {Payment} from '../models/payment.model';
import {PaymentMethod} from '../models/payment-method.model';
import {PaymentService} from '../payment.service';
import {AppDateFieldComponent} from "@shared/ui/inputs/forms/data.component";
import {FormFieldComponent} from "@shared/ui/inputs/forms/form-field.component";
import {FormSelectComponent} from "@shared/ui/inputs/forms/form-select.component";
import {FormCustomerComponent} from "@shared/ui/inputs/forms/form-customer.component";
import {SearchByCustomerComponent} from "@features/shared/ui/search-by-customer.component";
import {SearchByEngagementLetterComponent} from "@features/shared/ui/search-by-engagement-letter.component";
import {User} from "@features/shared/models/user.model";

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
        AppDateFieldComponent,
        FormFieldComponent,
        FormSelectComponent,
        FormCustomerComponent,
        SearchByCustomerComponent,
        SearchByEngagementLetterComponent,
    ],
    templateUrl: 'payment-creation-updating-dialog.component.html'
})
export class PaymentCreationUpdatingDialogComponent {
    title: string;
    methods = of(Object.values(PaymentMethod));
    payment: Payment = {
        id: undefined,
        date: undefined,
        engagement: undefined,
        user: {},
        amount: undefined,
        method: undefined,
    };
    selectedEngagementLetter: EngagementLetter;
    selectedUser: User;
    private paymentDateValue: Date | null = null;

    constructor(
        private readonly paymentService: PaymentService,
        private readonly dialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) data?: Payment
    ) {
        this.title = data?.id ? 'Edicion de Ingreso' : 'Creacion de Ingreso';
        this.payment = {
            id: data?.id,
            date: data?.date,
            engagement: data?.engagement,
            user: data?.user ?? {},
            amount: data?.amount,
            method: data?.method,
        };
        this.selectedEngagementLetter = data?.engagement as EngagementLetter;
        this.selectedUser = data?.user as User;
        this.paymentDate = data?.date;
    }

    get paymentDate(): Date | null {
        return this.paymentDateValue;
    }

    set paymentDate(value: Date | string | null | undefined) {
        const parsedDate = value instanceof Date ? value : this.parseDate(value);
        this.paymentDateValue = parsedDate;
        this.payment.date = parsedDate ? this.formatDate(parsedDate) : undefined;
    }

    create(): void {
        if (!this.isCreate() || !this.canSubmit()) {
            return;
        }
        this.paymentService
            .create(this.buildPayment())
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        if (this.isCreate() || !this.payment.id || !this.canSubmit()) {
            return;
        }

        const {id, ...payment} = this.buildPayment();
        this.paymentService
            .update(id, payment)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return !this.payment.id;
    }

    canSubmit(): boolean {
        return this.hasValidDate()
            && this.hasUser()
            && this.hasValidAmount()
            && !!this.payment.method;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    setUser(user: User): void {
        this.selectedUser = user;
    }

    setEngagementLetter(engagementLetter: EngagementLetter): void {
        this.selectedEngagementLetter = engagementLetter;
    }

    removeUser(): void {
        this.selectedUser = undefined;
    }

    removeEngagementLetter(): void {
        this.selectedEngagementLetter = undefined;
    }

    private hasUser(): boolean {
        return !!this.selectedUser;
    }

    private hasValidAmount(): boolean {
        const amount = Number(this.payment.amount);
        return Number.isFinite(amount) && amount > 0;
    }

    private hasValidDate(): boolean {
        return this.paymentDateValue !== null || this.parseDate(this.payment.date) !== null;
    }

    private buildPayment(): Payment {
        return {
            ...this.payment,
            engagement: this.selectedEngagementLetter?.id ? {id: this.selectedEngagementLetter.id} : undefined,
            user: {
                id: this.selectedUser.id,
                mobile: this.selectedUser.mobile,
                firstName: this.selectedUser.firstName,
                familyName: this.selectedUser.familyName,
            },
        };
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
