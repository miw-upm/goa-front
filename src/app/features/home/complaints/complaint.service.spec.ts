import {of} from 'rxjs';
import {ENDPOINTS} from '@core/api/endpoints';
import {Complaint} from './models/complaint.model';
import {ComplaintService} from './complaint.service';
import {Status} from './models/status.enum';

describe('ComplaintService', () => {
    let service: ComplaintService;

    let requestBuilderSpy: {
        success: jasmine.Spy;
        get: jasmine.Spy;
        post: jasmine.Spy;
    };

    let httpServiceSpy: {
        request: jasmine.Spy;
    };

    beforeEach(() => {
        // Configuramos el espía del builder para que devuelva 'this' en cada llamada
        requestBuilderSpy = {
            success: jasmine.createSpy('success'),
            get: jasmine.createSpy('get'),
            post: jasmine.createSpy('post')
        };

        requestBuilderSpy.success.and.returnValue(requestBuilderSpy);

        httpServiceSpy = {
            request: jasmine.createSpy('request').and.returnValue(requestBuilderSpy)
        };

        service = new ComplaintService(httpServiceSpy as any);
    });

    it('should read complaint with GET to complaint by id endpoint', () => {
        const response: Complaint = {
            id: 'complaint-1',
            engagementId: 'eng-1',
            mobile: '600123456',
            description: 'Problema técnico',
            status: Status.OPEN,
            createdAt: '2026-03-20T10:00:00'
        };

        requestBuilderSpy.get.and.returnValue(of(response));

        service.read('complaint-1').subscribe(complaint => {
            expect(complaint).toEqual(response);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.complaints.byId('complaint-1'));
    });

    it('should create complaint with POST to complaints endpoint', () => {
        const payload: Complaint = {
            engagementId: 'eng-1',
            description: 'Service issue',
            status: Status.OPEN,
            createdAt: '2026-05-31T15:00:00'
        };

        requestBuilderSpy.post.and.returnValue(of(payload));

        service.create(payload).subscribe(response => {
            expect(response).toEqual(payload);
        });

        // Verificamos el flujo de llamadas
        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.success).toHaveBeenCalled();

        // Verificamos que se llame al endpoint correcto con el payload correcto
        expect(requestBuilderSpy.post).toHaveBeenCalledWith(
            ENDPOINTS.complaints.root,
            payload
        );
    });
});