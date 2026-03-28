import {of} from 'rxjs';

import {ExpenseCreationDialogComponent} from '../dialogs/expense-creation-dialog.component';
import {ExpensesComponent} from './expenses.component';
import {Expense} from '../models/expense.model';

describe('ExpensesComponent', () => {
    let dialogSpy: {
        open: jasmine.Spy;
    };

    let expenseServiceSpy: {};

    beforeEach(() => {
        dialogSpy = {
            open: jasmine.createSpy('open').and.returnValue({
                afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
            })
        };

        expenseServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([]))
        };
    });

    it('should initialize title and empty list', (done) => {
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);

        expect(component.title).toBe('Gastos');

        component.expenses.subscribe(items => {
            expect(items).toEqual([]);
            done();
        });
    });

    it('should open expense creation dialog with width 600px', () => {
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);

        component.create();

        expect(dialogSpy.open).toHaveBeenCalledWith(ExpenseCreationDialogComponent, {width: '600px'});
    });

    it('should call afterClosed on opened dialog', () => {
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);
        const openedDialog = dialogSpy.open.calls.mostRecent;

        component.create();

        const dialogRef = dialogSpy.open.calls.mostRecent().returnValue;
        expect(dialogRef.afterClosed).toHaveBeenCalled();
        expect(openedDialog).toBeDefined();
    });

    it('should call search on expense service', () => {
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);

        component.search();

        expect((expenseServiceSpy as any).search).toHaveBeenCalled();
    });

    it('should format date correctly before searching', () => {
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);
        component.criteria = { date: 'Sun Mar 15 2026 00:00:00 GMT+0100' };
        const expectedFormattedDate = '2026-03-15';

        component.search();

        expect((expenseServiceSpy as any).search).toHaveBeenCalledWith({ date: expectedFormattedDate });
    });

    it('should not format date if it is not present', () => {
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);
        component.criteria = {};

        component.search();

        expect((expenseServiceSpy as any).search).toHaveBeenCalledWith({});
    });

    it('should update expenses on search', (done) => {
                const expectedExpenses: Expense[] = [{
            id: '11111111-1111-1111-1111-111111111111',
            engagementId: '22222222-2222-2222-2222-222222222222',
            amount: 100,
                        date: '2026-03-24',
            description: 'Test Expense'
        }];
        (expenseServiceSpy as any).search.and.returnValue(of(expectedExpenses));
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);

        component.search();

        component.expenses.subscribe(items => {
            expect(items).toEqual(expectedExpenses);
            done();
        });
    });
});
