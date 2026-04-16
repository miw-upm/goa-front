import {of} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {Expense} from './models/expense.model';
import {ExpenseService} from './expense.service';
import {ExpenseSearch} from "./models/expense-search.model";

describe('ExpenseService', () => {
    let service: ExpenseService;

    let requestBuilderSpy: {
        success: jasmine.Spy;
        post: jasmine.Spy;
        put: jasmine.Spy;
        paramsFrom: jasmine.Spy;
        get: jasmine.Spy;
    };

    let httpServiceSpy: {
        request: jasmine.Spy;
    };

    beforeEach(() => {
        requestBuilderSpy = {
            success: jasmine.createSpy('success'),
            post: jasmine.createSpy('post'),
            put: jasmine.createSpy('put'),
            paramsFrom: jasmine.createSpy('paramsFrom'),
            get: jasmine.createSpy('get')
        };

        requestBuilderSpy.success.and.returnValue(requestBuilderSpy);
        requestBuilderSpy.paramsFrom.and.returnValue(requestBuilderSpy);

        httpServiceSpy = {
            request: jasmine.createSpy('request').and.returnValue(requestBuilderSpy)
        };

        service = new ExpenseService(httpServiceSpy as any);
    });

    it('should create expense with POST to expenses endpoint', () => {
        const payload: Expense = {
            engagementId: 'eng-1',
            amount: 150.5,
            date: '2026-03-20',
            description: 'Taxi'
        };

        requestBuilderSpy.post.and.returnValue(of(payload));

        service.create(payload).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.success).toHaveBeenCalled();
        expect(requestBuilderSpy.post).toHaveBeenCalledWith(ENDPOINTS.expenses.root, payload);
    });

    it('should read expense with GET to expense by id endpoint', () => {
        const response: Expense = {
            id: 'expense-1',
            engagementId: 'eng-1',
            amount: 150.5,
            date: '2026-03-20',
            description: 'Taxi'
        };

        requestBuilderSpy.get.and.returnValue(of(response));

        service.read('expense-1').subscribe(expense => {
            expect(expense).toEqual(response);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.expenses.byId('expense-1'));
    });

    it('should search expenses with GET from expenses endpoint', () => {
        const search: ExpenseSearch = {date: '2026-01-01', engagementId: '11111111-1111-1111-1111-111111111111'};
        const expectedExpenses: Expense[] = [
            {id: '1', engagementId: '11111111-1111-1111-1111-111111111111', amount: 150.5, date: '2026-01-01', description: 'Taxi'},
        ];

        requestBuilderSpy.get.and.returnValue(of(expectedExpenses));

        service.search(search).subscribe(response => {
            expect(response).toEqual(expectedExpenses);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.paramsFrom).toHaveBeenCalledWith(search);
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.expenses.root);
    });

    it('should update expense with PUT to expense by id endpoint', () => {
        const id = 'expense-1';
        const payload: Expense = {
            engagementId: 'eng-1',
            amount: 200,
            date: '2026-03-21',
            description: 'Updated Taxi'
        };

        requestBuilderSpy.put.and.returnValue(of(payload));

        service.update(id, payload).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.success).toHaveBeenCalled();
        expect(requestBuilderSpy.put).toHaveBeenCalledWith(ENDPOINTS.expenses.byId(id), payload);
    });
});
