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

    it('should search expenses with GET from expenses endpoint', () => {
        const search: ExpenseSearch = {date: '2026-01-01'};
        const expectedExpenses: Expense[] = [
            {id: '1', engagementId: 'eng-1', amount: 150.5, date: '2026-01-01', description: 'Taxi'},
            {id: '2', engagementId: 'eng-2', amount: 50, date: '2026-01-01', description: 'Lunch'}
        ];

        requestBuilderSpy.get.and.returnValue(of(expectedExpenses));

        service.search(search).subscribe(response => {
            expect(response).toEqual(expectedExpenses);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.paramsFrom).toHaveBeenCalledWith(search);
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.expenses.root);
    });
});
