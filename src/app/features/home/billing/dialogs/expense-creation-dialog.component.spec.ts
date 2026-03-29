import {of} from 'rxjs';

import {ExpenseCreationDialogComponent} from './expense-creation-dialog.component';
import {Expense} from '../models/expense.model';

describe('ExpenseCreationDialogComponent', () => {
    let expenseServiceSpy: {
        create: jasmine.Spy;
        update: jasmine.Spy;
    };

    let engagementLetterServiceSpy: {
        search: jasmine.Spy;
    };

    let dialogSpy: {
        closeAll: jasmine.Spy;
    };

    beforeEach(() => {
        expenseServiceSpy = {
            create: jasmine.createSpy('create').and.returnValue(of({})),
            update: jasmine.createSpy('update').and.returnValue(of({}))
        };

        engagementLetterServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([
                {id: 'eng-1'},
                {id: undefined},
                {id: 'eng-2'}
            ]))
        };

        dialogSpy = {
            closeAll: jasmine.createSpy('closeAll')
        };
    });

    it('should load engagement ids from search and filter undefined ids', (done) => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );

        component.engagementIds.subscribe(ids => {
            expect(engagementLetterServiceSpy.search).toHaveBeenCalledWith({
                opened: true,
                owner: '',
                legalProcedureTitle: ''
            });
            expect(ids).toEqual(['eng-1', 'eng-2']);
            done();
        });
    });

    it('should return false in canSubmit when amount is zero', () => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.expense = {
            engagementId: 'eng-1',
            amount: 0,
            date: '2026-03-20',
            description: 'Gasto'
        };

        expect(component.canSubmit()).toBeFalse();
    });

    it('should return false in canSubmit when description is empty', () => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.expense = {
            engagementId: 'eng-1',
            amount: 1,
            date: '2026-03-20',
            description: '   '
        };

        expect(component.canSubmit()).toBeFalse();
    });

    it('should return false in canSubmit when date is invalid', () => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.expense = {
            engagementId: 'eng-1',
            amount: 1,
            date: 'not-a-date',
            description: 'Gasto'
        };

        expect(component.canSubmit()).toBeFalse();
    });

    it('should return true in canSubmit when all fields are valid', () => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.expense = {
            engagementId: 'eng-1',
            amount: 10,
            date: '2026-03-20',
            description: 'Gasto cliente'
        };

        expect(component.canSubmit()).toBeTrue();
    });

    it('should not call create service when form data is invalid', () => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.expense = {
            engagementId: 'eng-1',
            amount: 0,
            date: '2026-03-20',
            description: 'Gasto cliente'
        };

        component.create();

        expect(expenseServiceSpy.create).not.toHaveBeenCalled();
        expect(dialogSpy.closeAll).not.toHaveBeenCalled();
    });

    it('should call create service and close dialog when data is valid', () => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.expense = {
            engagementId: 'eng-1',
            amount: 9.99,
            date: '2026-03-20',
            description: 'Comida'
        };

        component.create();

        expect(expenseServiceSpy.create).toHaveBeenCalledWith(component.expense);
        expect(dialogSpy.closeAll).toHaveBeenCalled();
    });

    it('should format selected expense date from datepicker before submit', () => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );

        component.expenseDate = new Date(2026, 2, 21);

        expect(component.expense.date).toBe('2026-03-21');
    });

    it('should initialize in update mode when expense data is provided', () => {
        const existingExpense: Expense = {
            id: 'expense-1',
            engagementId: 'eng-1',
            amount: 9.99,
            date: '2026-03-20',
            description: 'Comida'
        };

        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any,
            existingExpense
        );

        expect(component.isCreate()).toBeFalse();
        expect(component.title).toBe('Actualizacion de Gasto');
        expect(component.expense).toEqual(existingExpense);
    });

    it('should call update service without editable id and close dialog when update data is valid', () => {
        const existingExpense: Expense = {
            id: 'expense-1',
            engagementId: 'eng-1',
            amount: 9.99,
            date: '2026-03-20',
            description: 'Comida'
        };

        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any,
            existingExpense
        );

        component.expense.amount = 15;
        component.expense.description = 'Comida actualizada';

        component.update();

        expect(expenseServiceSpy.update).toHaveBeenCalledWith('expense-1', {
            engagementId: 'eng-1',
            amount: 15,
            date: '2026-03-20',
            description: 'Comida actualizada'
        });
        expect(dialogSpy.closeAll).toHaveBeenCalled();
    });

    it('should not call update service when update data is invalid', () => {
        const existingExpense: Expense = {
            id: 'expense-1',
            engagementId: 'eng-1',
            amount: 9.99,
            date: '2026-03-20',
            description: 'Comida'
        };

        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any,
            existingExpense
        );

        component.expense.description = '   ';

        component.update();

        expect(expenseServiceSpy.update).not.toHaveBeenCalled();
        expect(dialogSpy.closeAll).not.toHaveBeenCalled();
    });

    it('should return true when all controls are valid in formInvalid', () => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );

        const validControl = {invalid: false, dirty: false, touched: false} as any;

        expect(component.formInvalid(validControl)).toBeFalse();
    });

    it('should return true when at least one control is invalid and touched', () => {
        const component = new ExpenseCreationDialogComponent(
            expenseServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );

        const validControl = {invalid: false, dirty: false, touched: false} as any;
        const invalidTouchedControl = {invalid: true, dirty: false, touched: true} as any;

        expect(component.formInvalid(validControl, invalidTouchedControl)).toBeTrue();
    });
});
