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

    it('should order incomes by date descending on search', (done) => {
        const unorderedIncomes: Income[] = [{
            id: '1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 30,
            date: '2026-03-20'
        }, {
            id: '2',
            engagementId: 'eng-2',
            userId: 'user-2',
            amount: 50,
            date: '2026-03-25'
        }, {
            id: '3',
            engagementId: 'eng-3',
            userId: 'user-3',
            amount: 40,
            date: '2026-03-24'
        }];

        incomeServiceSpy.search.and.returnValue(of(unorderedIncomes));
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        component.search();

        component.incomes.subscribe(items => {
            expect(items.map(item => item.date)).toEqual(['2026-03-25', '2026-03-24', '2026-03-20']);
            done();
        });
    });

    it('should keep duplicated dates and place the most recent date first', (done) => {
        const duplicatedDatesIncomes: Income[] = [{
            id: '1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 10,
            date: '2026-03-24'
        }, {
            id: '2',
            engagementId: 'eng-2',
            userId: 'user-2',
            amount: 20,
            date: '2026-03-25'
        }, {
            id: '3',
            engagementId: 'eng-3',
            userId: 'user-3',
            amount: 30,
            date: '2026-03-24'
        }];

        incomeServiceSpy.search.and.returnValue(of(duplicatedDatesIncomes));
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        component.search();

        component.incomes.subscribe(items => {
            expect(items.length).toBe(3);
            expect(items[0].date).toBe('2026-03-25');
            expect(items.map(item => item.date)).toEqual(['2026-03-25', '2026-03-24', '2026-03-24']);
            done();
        });
    });

    it('should order incomes correctly across year boundaries', (done) => {
        const crossYearIncomes: Income[] = [{
            id: '1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 10,
            date: '2026-01-01'
        }, {
            id: '2',
            engagementId: 'eng-2',
            userId: 'user-2',
            amount: 20,
            date: '2025-12-31'
        }, {
            id: '3',
            engagementId: 'eng-3',
            userId: 'user-3',
            amount: 30,
            date: '2026-01-02'
        }];

        incomeServiceSpy.search.and.returnValue(of(crossYearIncomes));
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        component.search();

        component.incomes.subscribe(items => {
            expect(items.map(item => item.date)).toEqual(['2026-01-02', '2026-01-01', '2025-12-31']);
            done();
        });
    });
});

