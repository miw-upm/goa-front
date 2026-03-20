import {of} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {Expense} from './models/expense.model';
import {ExpenseService} from './expense.service';

describe('ExpenseService', () => {
    let service: ExpenseService;

    let requestBuilderSpy: {
        success: jasmine.Spy;
        post: jasmine.Spy;
    };

    let httpServiceSpy: {
        request: jasmine.Spy;
    };

    beforeEach(() => {
        requestBuilderSpy = {
            success: jasmine.createSpy('success'),
            post: jasmine.createSpy('post')
        };

        requestBuilderSpy.success.and.returnValue(requestBuilderSpy);

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
});
