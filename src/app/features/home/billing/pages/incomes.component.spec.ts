import {of} from 'rxjs';

import {IncomeCreationDialogComponent} from '../dialogs/income-creation-dialog.component';
import {Income} from '../models/income.model';
import {IncomesComponent} from './incomes.component';

describe('IncomesComponent', () => {
    let dialogSpy: {
        open: jasmine.Spy;
    };

    let incomeServiceSpy: {
        search: jasmine.Spy;
    };

    beforeEach(() => {
        dialogSpy = {
            open: jasmine.createSpy('open').and.returnValue({
                afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
            })
        };

        incomeServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([]))
        };
    });

    it('should initialize title and empty list', (done) => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        expect(component.title).toBe('Ingresos');

        component.incomes.subscribe(items => {
            expect(items).toEqual([]);
            done();
        });
    });

    it('should open income creation dialog with width 600px', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        component.create();

        expect(dialogSpy.open).toHaveBeenCalledWith(IncomeCreationDialogComponent, {width: '600px'});
    });

    it('should call afterClosed on opened dialog', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        component.create();

        const dialogRef = dialogSpy.open.calls.mostRecent().returnValue;
        expect(dialogRef.afterClosed).toHaveBeenCalled();
    });

    it('should call search on income service', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        component.search();

        expect(incomeServiceSpy.search).toHaveBeenCalled();
    });

    it('should update incomes on search', (done) => {
        const expectedIncomes: Income[] = [{
            id: '11111111-1111-1111-1111-111111111111',
            engagementId: '22222222-2222-2222-2222-222222222222',
            userId: '33333333-3333-3333-3333-333333333333',
            amount: 100,
            date: '2026-03-24'
        }];
        incomeServiceSpy.search.and.returnValue(of(expectedIncomes));
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        component.search();

        component.incomes.subscribe(items => {
            expect(items).toEqual(expectedIncomes);
            done();
        });
    });
});

