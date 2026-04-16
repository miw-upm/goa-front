import {of, throwError} from 'rxjs';

import {IncomeCreationDialogComponent} from '../dialogs/income-creation-dialog.component';
import {Income} from '../models/income.model';
import {IncomesComponent} from './incomes.component';

describe('IncomesComponent', () => {
    let dialogSpy: {
        open: jasmine.Spy;
    };

    let incomeServiceSpy: {
        search: jasmine.Spy;
        read: jasmine.Spy;
    };

    beforeEach(() => {
        dialogSpy = {
            open: jasmine.createSpy('open').and.returnValue({
                afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
            })
        };

        incomeServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([])),
            read: jasmine.createSpy('read').and.returnValue(of({
                id: '11111111-1111-1111-1111-111111111111',
                engagementId: '22222222-2222-2222-2222-222222222222',
                userId: '33333333-3333-3333-3333-333333333333',
                amount: 100,
                date: '2026-03-24'
            }))
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

    it('should open income update dialog with selected income', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        const income: Income = {
            id: '11111111-1111-1111-1111-111111111111',
            engagementId: '22222222-2222-2222-2222-222222222222',
            userId: '33333333-3333-3333-3333-333333333333',
            amount: 100,
            date: '2026-03-24'
        };

        component.update(income);

        expect(dialogSpy.open).toHaveBeenCalledWith(IncomeCreationDialogComponent, {
            width: '600px',
            data: income
        });
    });

    it('should not open income update dialog when income has no id', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        const income = {
            engagementId: '22222222-2222-2222-2222-222222222222',
            userId: '33333333-3333-3333-3333-333333333333',
            amount: 100,
            date: '2026-03-24'
        } as Income;

        component.update(income);

        expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it('should call search on income service', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        component.search();

        expect(incomeServiceSpy.search).toHaveBeenCalled();
    });

    it('should format date correctly before searching', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        const testDate = new Date(Date.UTC(2026, 2, 22));
        component.criteria = {date: testDate.toString()};
        const expectedFormattedDate = '2026-03-22';

        component.search();

        expect(incomeServiceSpy.search).toHaveBeenCalledWith({date: expectedFormattedDate});
    });

    it('should search incomes with engagementId and date criteria', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        component.criteria = {
            engagementId: 'eng-1',
            date: '2026-03-22'
        };

        component.search();

        expect(incomeServiceSpy.search).toHaveBeenCalledWith({
            engagementId: 'eng-1',
            date: '2026-03-22'
        });
    });

    it('should normalize Date criteria and keep engagementId when searching', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        component.criteria = {
            engagementId: 'eng-1',
            date: new Date(Date.UTC(2026, 2, 22)).toString()
        };

        component.search();

        expect(incomeServiceSpy.search).toHaveBeenCalledWith({
            engagementId: 'eng-1',
            date: '2026-03-22'
        });
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

    it('should initialize criteria with empty object on construction', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        expect(component.criteria).toEqual({});
    });

    it('should reset criteria to empty object', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        component.criteria = {engagementId: 'some-id'};

        component.resetSearch();

        expect(component.criteria).toEqual({});
    });

    it('should pass criteria to income service search', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        component.criteria = {engagementId: 'test-engagement-id'};

        component.search();

        expect(incomeServiceSpy.search).toHaveBeenCalledWith({engagementId: 'test-engagement-id'});
    });

    it('should filter incomes by engagementId', (done) => {
        const incomesWithFilter: Income[] = [{
            id: '1',
            engagementId: 'target-engagement',
            userId: 'user-1',
            amount: 100,
            date: '2026-03-24'
        }];
        incomeServiceSpy.search.and.returnValue(of(incomesWithFilter));
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        component.criteria = {engagementId: 'target-engagement'};

        component.search();

        component.incomes.subscribe(items => {
            expect(items.length).toBe(1);
            expect(items[0].engagementId).toBe('target-engagement');
            done();
        });
    });

    it('should call read on income service with selected id', () => {
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        const income: Income = {
            id: 'income-1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 80,
            date: '2026-03-25'
        };

        component.read(income);

        expect(incomeServiceSpy.read).toHaveBeenCalledWith('income-1');
    });

    it('should update income item on read', (done) => {
        const expectedIncome: Income = {
            id: 'income-1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 80,
            date: '2026-03-25'
        };
        incomeServiceSpy.read.and.returnValue(of(expectedIncome));
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);

        component.read(expectedIncome);

        component.income.subscribe(item => {
            expect(item).toEqual(expectedIncome);
            done();
        });
    });

    it('should return empty list when engagementId is invalid', (done) => {
        incomeServiceSpy.search.and.returnValue(throwError(() => new Error('Invalid engagement ID')));
        const component = new IncomesComponent(dialogSpy as any, incomeServiceSpy as any);
        component.criteria = {engagementId: 'invalid-id'};

        component.search();

        component.incomes.subscribe(items => {
            expect(items).toEqual([]);
            done();
        });
    });
});
