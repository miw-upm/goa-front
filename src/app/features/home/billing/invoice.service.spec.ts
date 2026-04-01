import {of} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {InvoiceService} from './invoice.service';
import {Invoice} from './models/invoice.model';

describe('InvoiceService', () => {
    let service: InvoiceService;

    let requestBuilderSpy: {
        paramsFrom: jasmine.Spy;
        get: jasmine.Spy;
    };

    let httpServiceSpy: {
        request: jasmine.Spy;
    };

    beforeEach(() => {
        requestBuilderSpy = {
            paramsFrom: jasmine.createSpy('paramsFrom'),
            get: jasmine.createSpy('get')
        };

        requestBuilderSpy.paramsFrom.and.returnValue(requestBuilderSpy);

        httpServiceSpy = {
            request: jasmine.createSpy('request').and.returnValue(requestBuilderSpy)
        };

        service = new InvoiceService(httpServiceSpy as any);
    });

    it('should search invoices with criteria using paramsFrom', () => {
        const criteria = {engagementId: 'eng-1'};
        const payload: Invoice[] = [{
            id: 'inv-1',
            engagementId: 'eng-1',
            date: '2026-03-24',
            expenses: [],
            incomes: []
        }];

        requestBuilderSpy.get.and.returnValue(of(payload));

        service.search(criteria).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.paramsFrom).toHaveBeenCalledWith(criteria);
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.invoices.root);
    });

    it('should search invoices without params when criteria has no engagementId', () => {
        const payload: Invoice[] = [];

        requestBuilderSpy.get.and.returnValue(of(payload));

        service.search({}).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.paramsFrom).not.toHaveBeenCalled();
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.invoices.root);
    });
});
