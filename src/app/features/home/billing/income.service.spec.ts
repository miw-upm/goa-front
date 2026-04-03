import {of} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {Income} from './models/income.model';
import {IncomeService} from './income.service';

describe('IncomeService', () => {
    let service: IncomeService;

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

    it('should read income with GET to income by id endpoint', () => {
        const response: Income = {
            id: 'inc-1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 80,
            date: '2026-03-24'
        };

        requestBuilderSpy.get.and.returnValue(of(response));

        service.read('inc-1').subscribe(income => {
            expect(income).toEqual(response);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.incomes.byId('inc-1'));
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

    it('should update income with PUT to income by id endpoint', () => {
        const payload: Income = {
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 150.5,
            date: '2026-03-24'
        };

        requestBuilderSpy.put.and.returnValue(of(payload));

        service.update('inc-1', payload).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.success).toHaveBeenCalled();
        expect(requestBuilderSpy.put).toHaveBeenCalledWith(ENDPOINTS.incomes.byId('inc-1'), payload);
    });

    it('should search incomes with criteria using paramsFrom', () => {
        const payload: Income[] = [{
            id: 'inc-1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 80,
            date: '2026-03-24'
        }];

        requestBuilderSpy.get.and.returnValue(of(payload));

        service.search({engagementId: 'eng-1'}).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.paramsFrom).toHaveBeenCalledWith({engagementId: 'eng-1'});
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.incomes.root);
    });

    it('should search incomes with engagementId and date using paramsFrom', () => {
        const payload: Income[] = [{
            id: 'inc-1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 80,
            date: '2026-03-22'
        }];

        requestBuilderSpy.get.and.returnValue(of(payload));

        service.search({engagementId: 'eng-1', date: '2026-03-22'}).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.paramsFrom).toHaveBeenCalledWith({engagementId: 'eng-1', date: '2026-03-22'});
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.incomes.root);
    });

    it('should search incomes without criteria calling the incomes root endpoint directly', () => {
        const payload: Income[] = [{
            id: 'inc-1',
            engagementId: 'eng-1',
            userId: 'user-1',
            amount: 80,
            date: '2026-03-22'
        }];

        requestBuilderSpy.get.and.returnValue(of(payload));

        service.search().subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.paramsFrom).not.toHaveBeenCalled();
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.incomes.root);
    });
});

