import {of} from 'rxjs';

import {InvoiceCreationDialogComponent} from './invoice-creation-dialog.component';

describe('InvoiceCreationDialogComponent', () => {
    let invoiceServiceSpy: {
        create: jasmine.Spy;
        search: jasmine.Spy;
    };

    let expenseServiceSpy: {
        search: jasmine.Spy;
    };

    let incomeServiceSpy: {
        search: jasmine.Spy;
    };

    let engagementLetterServiceSpy: {
        search: jasmine.Spy;
    };

    let dialogSpy: {
        closeAll: jasmine.Spy;
    };

    beforeEach(() => {
        invoiceServiceSpy = {
            create: jasmine.createSpy('create').and.returnValue(of({})),
            search: jasmine.createSpy('search').and.returnValue(of([
                {
                    id: 'inv-1',
                    engagementId: 'eng-1',
                    date: '2026-04-01',
                    expenses: [{id: 'exp-2'}],
                    incomes: [{id: 'inc-2'}]
                }
            ]))
        };

        expenseServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([
                {
                    id: 'exp-1',
                    engagementId: 'eng-1',
                    amount: 50,
                    date: '2026-04-01',
                    description: 'Taxi'
                },
                {
                    id: 'exp-2',
                    engagementId: 'eng-1',
                    amount: 70,
                    date: '2026-04-02',
                    description: 'Hotel'
                }
            ]))
        };

        incomeServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([
                {
                    id: 'inc-1',
                    engagementId: 'eng-1',
                    userId: 'user-1',
                    amount: 100,
                    date: '2026-04-01'
                },
                {
                    id: 'inc-2',
                    engagementId: 'eng-1',
                    userId: 'user-2',
                    amount: 200,
                    date: '2026-04-03'
                }
            ]))
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
        const component = new InvoiceCreationDialogComponent(
            invoiceServiceSpy as any,
            expenseServiceSpy as any,
            incomeServiceSpy as any,
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

    it('should clear selections and empty available items when engagement is removed', (done) => {
        const component = new InvoiceCreationDialogComponent(
            invoiceServiceSpy as any,
            expenseServiceSpy as any,
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.invoice.expenseIds = ['exp-1'];
        component.invoice.incomeIds = ['inc-1'];

        component.onEngagementChange(undefined);

        expect(component.invoice.expenseIds).toEqual([]);
        expect(component.invoice.incomeIds).toEqual([]);

        component.availableExpenses.subscribe(expenses => {
            expect(expenses).toEqual([]);
            done();
        });
    });

    it('should load only non invoiced expenses and incomes for selected engagement', (done) => {
        const component = new InvoiceCreationDialogComponent(
            invoiceServiceSpy as any,
            expenseServiceSpy as any,
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );

        component.onEngagementChange('eng-1');

        component.availableExpenses.subscribe(expenses => {
            expect(invoiceServiceSpy.search).toHaveBeenCalledWith({engagementId: 'eng-1'});
            expect(expenseServiceSpy.search).toHaveBeenCalledWith({engagementId: 'eng-1'});
            expect(expenses.map(expense => expense.id)).toEqual(['exp-1']);
        });

        component.availableIncomes.subscribe(incomes => {
            expect(incomeServiceSpy.search).toHaveBeenCalledWith({engagementId: 'eng-1'});
            expect(incomes.map(income => income.id)).toEqual(['inc-1']);
            done();
        });
    });

    it('should return false in canSubmit when engagement is missing', () => {
        const component = new InvoiceCreationDialogComponent(
            invoiceServiceSpy as any,
            expenseServiceSpy as any,
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.invoice = {
            engagementId: undefined,
            date: undefined,
            expenseIds: ['exp-1'],
            incomeIds: []
        };

        expect(component.canSubmit()).toBeFalse();
    });

    it('should return false in canSubmit when no expense or income is selected', () => {
        const component = new InvoiceCreationDialogComponent(
            invoiceServiceSpy as any,
            expenseServiceSpy as any,
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.invoice = {
            engagementId: 'eng-1',
            date: undefined,
            expenseIds: [],
            incomeIds: []
        };

        expect(component.canSubmit()).toBeFalse();
    });

    it('should return true in canSubmit when engagement and at least one item are selected', () => {
        const component = new InvoiceCreationDialogComponent(
            invoiceServiceSpy as any,
            expenseServiceSpy as any,
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.invoice = {
            engagementId: 'eng-1',
            date: undefined,
            expenseIds: ['exp-1'],
            incomeIds: []
        };

        expect(component.canSubmit()).toBeTrue();
    });

    it('should use selected date when provided', () => {
        const component = new InvoiceCreationDialogComponent(
            invoiceServiceSpy as any,
            expenseServiceSpy as any,
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );

        component.invoiceDate = new Date(2026, 3, 4);

        expect(component.invoice.date).toBe('2026-04-04');
    });

    it('should not call create when data is invalid', () => {
        const component = new InvoiceCreationDialogComponent(
            invoiceServiceSpy as any,
            expenseServiceSpy as any,
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );

        component.create();

        expect(invoiceServiceSpy.create).not.toHaveBeenCalled();
        expect(dialogSpy.closeAll).not.toHaveBeenCalled();
    });

    it('should create invoice with current date when date is not selected', () => {
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(2026, 3, 4));

        const component = new InvoiceCreationDialogComponent(
            invoiceServiceSpy as any,
            expenseServiceSpy as any,
            incomeServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.invoice = {
            engagementId: 'eng-1',
            date: undefined,
            expenseIds: ['exp-1'],
            incomeIds: ['inc-1']
        };

        component.create();

        expect(invoiceServiceSpy.create).toHaveBeenCalledWith({
            engagementId: 'eng-1',
            date: '2026-04-04',
            expenseIds: ['exp-1'],
            incomeIds: ['inc-1']
        });
        expect(dialogSpy.closeAll).toHaveBeenCalled();

        jasmine.clock().uninstall();
    });
});
