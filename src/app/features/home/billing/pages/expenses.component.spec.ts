import {of} from 'rxjs';

import {ExpenseCreationDialogComponent} from '../dialogs/expense-creation-dialog.component';
import {ExpensesComponent} from './expenses.component';

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

        expenseServiceSpy = {};
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
});
