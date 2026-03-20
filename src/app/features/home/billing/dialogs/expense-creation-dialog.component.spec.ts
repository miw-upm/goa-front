import {of} from 'rxjs';

import {ExpenseCreationDialogComponent} from './expense-creation-dialog.component';

describe('ExpenseCreationDialogComponent', () => {
    let expenseServiceSpy: {
        create: jasmine.Spy;
    };

    let engagementLetterServiceSpy: {
        search: jasmine.Spy;
    };

    let dialogSpy: {
        closeAll: jasmine.Spy;
    };

    beforeEach(() => {
        expenseServiceSpy = {
            create: jasmine.createSpy('create').and.returnValue(of({}))
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

    it('should return false in canCreate when amount is zero', () => {
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

        expect(component.canCreate()).toBeFalse();
    });

    it('should return false in canCreate when description is empty', () => {
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

        expect(component.canCreate()).toBeFalse();
    });

    it('should return false in canCreate when date is invalid', () => {
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

        expect(component.canCreate()).toBeFalse();
    });

    it('should return true in canCreate when all fields are valid', () => {
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

        expect(component.canCreate()).toBeTrue();
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
