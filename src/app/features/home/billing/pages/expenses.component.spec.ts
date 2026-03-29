import {of} from 'rxjs';

import {ExpenseCreationDialogComponent} from '../dialogs/expense-creation-dialog.component';
import {ExpensesComponent} from './expenses.component';
import {Expense} from '../models/expense.model';

describe('ExpensesComponent', () => {
    let dialogSpy: {
        open: jasmine.Spy;
    };

    let expenseServiceSpy: {
        search: jasmine.Spy;
        read: jasmine.Spy;
    };

    beforeEach(() => {
        dialogSpy = {
            open: jasmine.createSpy('open').and.returnValue({
                afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
            })
        };

        expenseServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([])),
            read: jasmine.createSpy('read').and.returnValue(of({
                id: '11111111-1111-1111-1111-111111111111',
                engagementId: '22222222-2222-2222-2222-222222222222',
                amount: 100,
                date: '2026-03-24',
                description: 'Test Expense'
            }))
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

    it('should update expenses on search', (done) => {
        const expectedExpenses: Expense[] = [{
            id: '11111111-1111-1111-1111-111111111111',
            engagementId: '22222222-2222-2222-2222-222222222222',
            amount: 100,
            date: '2026-03-24',
            description: 'Test Expense'
        }];
        expenseServiceSpy.search.and.returnValue(of(expectedExpenses));
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);

        component.search();

        component.expenses.subscribe(items => {
            expect(items).toEqual(expectedExpenses);
            done();
        });
    });

    it('should call read on expense service with selected id', () => {
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);
        const expense: Expense = {
            id: 'expense-1',
            engagementId: 'eng-1',
            amount: 80,
            date: '2026-03-25',
            description: 'Hotel'
        };

        component.read(expense);

        expect(expenseServiceSpy.read).toHaveBeenCalledWith('expense-1');
    });

    it('should update expense item on read', (done) => {
        const expectedExpense: Expense = {
            id: 'expense-1',
            engagementId: 'eng-1',
            amount: 80,
            date: '2026-03-25',
            description: 'Hotel'
        };
        expenseServiceSpy.read.and.returnValue(of(expectedExpense));
        const component = new ExpensesComponent(dialogSpy as any, expenseServiceSpy as any);

        component.read(expectedExpense);

        component.expense.subscribe(item => {
            expect(item).toEqual(expectedExpense);
            done();
        });
    });
});
