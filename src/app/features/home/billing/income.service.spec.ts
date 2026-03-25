import {of} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {Income} from './models/income.model';
import {IncomeService} from './income.service';

describe('IncomeService', () => {
    let service: IncomeService;

    let requestBuilderSpy: {
        success: jasmine.Spy;
        post: jasmine.Spy;
        get: jasmine.Spy;
    };

    let httpServiceSpy: {
        request: jasmine.Spy;
    };

    beforeEach(() => {
        requestBuilderSpy = {
            success: jasmine.createSpy('success'),
            post: jasmine.createSpy('post'),
            get: jasmine.createSpy('get')
        };

        requestBuilderSpy.success.and.returnValue(requestBuilderSpy);

        httpServiceSpy = {
            request: jasmine.createSpy('request').and.returnValue(requestBuilderSpy)
        };

        service = new IncomeService(httpServiceSpy as any);
    });

    it('should create income with POST to incomes endpoint', () => {
        const payload: Income = {
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 150.5,
            date: '2026-03-24'
        };

        requestBuilderSpy.post.and.returnValue(of(payload));

        service.create(payload).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.success).toHaveBeenCalled();
        expect(requestBuilderSpy.post).toHaveBeenCalledWith(ENDPOINTS.incomes.root, payload);
    });

    it('should search incomes with GET to incomes endpoint', () => {
        const payload: Income[] = [{
            id: 'inc-1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 80,
            date: '2026-03-24'
        }];

        requestBuilderSpy.get.and.returnValue(of(payload));

        service.search().subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.incomes.root);
    });
});

