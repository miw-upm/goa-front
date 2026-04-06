import {of} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {InvoiceService} from './invoice.service';
import {Invoice} from './models/invoice.model';
import {InvoiceCreateRequest} from './models/invoice-create-request.model';

describe('InvoiceService', () => {
    let service: InvoiceService;

    let requestBuilderSpy: {
        paramsFrom: jasmine.Spy;
        get: jasmine.Spy;
        post: jasmine.Spy;
        put: jasmine.Spy;
        success: jasmine.Spy;
    };

    let httpServiceSpy: {
        request: jasmine.Spy;
    };

    beforeEach(() => {
        requestBuilderSpy = {
            paramsFrom: jasmine.createSpy('paramsFrom'),
            get: jasmine.createSpy('get'),
            post: jasmine.createSpy('post'),
            put: jasmine.createSpy('put'),
            success: jasmine.createSpy('success')
        };

        requestBuilderSpy.paramsFrom.and.returnValue(requestBuilderSpy);
        requestBuilderSpy.success.and.returnValue(requestBuilderSpy);

        httpServiceSpy = {
            request: jasmine.createSpy('request').and.returnValue(requestBuilderSpy)
        };

        service = new InvoiceService(httpServiceSpy as any);
    });

    it('should search invoices with criteria using paramsFrom', () => {
        const criteria = {
            engagementId: 'eng-1',
            date: '2026-03-22'
        };
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

    it('should search invoices filtering only by engagementId', () => {
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

    it('should search invoices without params when criteria is empty', () => {
        const payload: Invoice[] = [];

        requestBuilderSpy.get.and.returnValue(of(payload));

        service.search({}).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.paramsFrom).not.toHaveBeenCalled();
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.invoices.root);
    });

    it('should create invoice through invoices endpoint', () => {
        const request: InvoiceCreateRequest = {
            engagementId: 'eng-1',
            date: '2026-04-04',
            expenseIds: ['exp-1'],
            incomeIds: ['inc-1']
        };
        const payload = {
            id: 'inv-1',
            engagementId: 'eng-1',
            date: '2026-04-04',
            expenses: [{id: 'exp-1'}],
            incomes: [{id: 'inc-1'}]
        } as Invoice;

        requestBuilderSpy.post.and.returnValue(of(payload));

        service.create(request).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.success).toHaveBeenCalled();
        expect(requestBuilderSpy.post).toHaveBeenCalledWith(ENDPOINTS.invoices.root, request);
    });

    it('should read invoice with GET to invoice by id endpoint', () => {
        const payload: Invoice = {
            id: 'inv-1',
            engagementId: 'eng-1',
            date: '2026-04-04',
            expenses: [{id: 'exp-1', amount: 10}],
            incomes: [{id: 'inc-1', amount: 20}]
        };

        requestBuilderSpy.get.and.returnValue(of(payload));

        service.read('inv-1').subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.invoices.byId('inv-1'));
    });

    it('should update invoice through invoice by id endpoint', () => {
        const request: InvoiceCreateRequest = {
            engagementId: 'eng-1',
            date: '2026-04-05',
            expenseIds: ['exp-1'],
            incomeIds: ['inc-1']
        };
        const payload = {
            id: 'inv-1',
            engagementId: 'eng-1',
            date: '2026-04-05',
            expenses: [{id: 'exp-1'}],
            incomes: [{id: 'inc-1'}]
        } as Invoice;

        requestBuilderSpy.put.and.returnValue(of(payload));

        service.update('inv-1', request).subscribe(response => {
            expect(response).toEqual(payload);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.success).toHaveBeenCalled();
        expect(requestBuilderSpy.put).toHaveBeenCalledWith(ENDPOINTS.invoices.byId('inv-1'), request);
    });
});
