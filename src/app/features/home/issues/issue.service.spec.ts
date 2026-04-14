import {of} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {IssueService} from './issue.service';
import {IssueCreationRequest, IssueResponse, IssueStatus, IssueType} from './issue.model';
import {IssueSearch} from "./issue-search.model";

describe('IssueService', () => {
    let service: IssueService;

    let requestBuilderSpy: {
        error: jasmine.Spy;
        success: jasmine.Spy;
        get: jasmine.Spy;
        post: jasmine.Spy;
        put: jasmine.Spy;
        paramsFrom: jasmine.Spy;
    };

    let httpServiceSpy: {
        request: jasmine.Spy;
    };

    beforeEach(() => {
        requestBuilderSpy = {
            error: jasmine.createSpy('error'),
            success: jasmine.createSpy('success'),
            get: jasmine.createSpy('get'),
            post: jasmine.createSpy('post'),
            put: jasmine.createSpy('put'),
            paramsFrom: jasmine.createSpy('paramsFrom'),
        };

        requestBuilderSpy.error.and.returnValue(requestBuilderSpy);
        requestBuilderSpy.success.and.returnValue(requestBuilderSpy);

        httpServiceSpy = {
            request: jasmine.createSpy('request').and.returnValue(requestBuilderSpy)
        };

        service = new IssueService(httpServiceSpy as any);
    });

    it('should read issue by id', () => {
        const expectedResponse = {id: 'issue-1'};
        requestBuilderSpy.get.and.returnValue(of(expectedResponse));

        service.read('issue-1').subscribe(response => {
            expect(response).toEqual(expectedResponse);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.error).toHaveBeenCalledWith('No se pudo cargar la incidencia');
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.issues.byId('issue-1'));
    });

    it('should create issue', () => {
        const payload: IssueCreationRequest = {
            title: 'Title',
            description: 'Description',
            technicalContext: 'Context',
            type: IssueType.BUG
        };
        const expectedResponse = {id: 'issue-2'};
        requestBuilderSpy.post.and.returnValue(of(expectedResponse));

        service.create(payload).subscribe(response => {
            expect(response).toEqual(expectedResponse);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.success).toHaveBeenCalledWith('Incidencia creada correctamente');
        expect(requestBuilderSpy.error).toHaveBeenCalledWith('No se pudo crear la incidencia');
        expect(requestBuilderSpy.post).toHaveBeenCalledWith(ENDPOINTS.issues.root, payload);
    });

    it('should sync issue', () => {
        const expectedResponse = {id: 'issue-3'};
        requestBuilderSpy.put.and.returnValue(of(expectedResponse));

        service.sync('issue-3').subscribe(response => {
            expect(response).toEqual(expectedResponse);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.success).toHaveBeenCalledWith('Incidencia sincronizada correctamente');
        expect(requestBuilderSpy.error).toHaveBeenCalledWith('No se pudo sincronizar la incidencia');
        expect(requestBuilderSpy.put).toHaveBeenCalledWith(ENDPOINTS.issues.syncById('issue-3'));
    });

    it('should search issues with GET from issues endpoint', () => {
        const search: IssueSearch = {
            type: IssueType.BUG,
            status: IssueStatus.PENDING
        };
        const expectedIssues: IssueResponse[] = [
            {
                id: '1',
                title: 'Login not working',
                type: IssueType.BUG,
                status: IssueStatus.PENDING,
                createdAt: '2026-04-14',
                description: 'Users cannot login to the system'
            },
        ];

        requestBuilderSpy.get.and.returnValue(of(expectedIssues));

        service.search(search).subscribe(response => {
            expect(response).toEqual(expectedIssues);
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.paramsFrom).toHaveBeenCalledWith(search);
        expect(requestBuilderSpy.get).toHaveBeenCalledWith(ENDPOINTS.issues.root);
    });
});
