import {ActivatedRoute} from '@angular/router';
import {of, throwError} from 'rxjs';

import {IssueStatus} from '../issue.model';
import {IssueDetailComponent} from './issue-detail.component';

describe('IssueDetailComponent', () => {
    let issueServiceSpy: {
        read: jasmine.Spy;
        sync: jasmine.Spy;
    };

    const activatedRouteStub = {
        snapshot: {
            paramMap: {
                get: () => 'issue-123'
            }
        }
    } as unknown as ActivatedRoute;

    beforeEach(() => {
        issueServiceSpy = {
            read: jasmine.createSpy('read').and.returnValue(of({
                id: 'issue-123',
                title: 'Issue title',
                status: IssueStatus.PENDING
            })),
            sync: jasmine.createSpy('sync').and.returnValue(of({id: 'issue-123'}))
        };
    });

    it('should load issue on creation', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        expect(issueServiceSpy.read).toHaveBeenCalledWith('issue-123');
        expect(component.issue?.id).toBe('issue-123');
        expect(component.loading).toBeFalse();
    });

    it('should set local error message when issue read fails', () => {
        issueServiceSpy.read.and.returnValue(throwError(() => ({message: 'boom'})));

        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        expect(component.issue).toBeUndefined();
        expect(component.localErrorMessage).toBe('boom');
        expect(component.loading).toBeFalse();
    });

    it('should sync and reload issue on refresh success', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);
        const loadIssueSpy = spyOn(component, 'loadIssue').and.callFake(() => undefined);

        component.refresh();

        expect(issueServiceSpy.sync).toHaveBeenCalledWith('issue-123');
        expect(component.syncing).toBeFalse();
        expect(loadIssueSpy).toHaveBeenCalled();
    });

    it('should not refresh when issue id is missing', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);
        component.issueId = '';

        component.refresh();

        expect(issueServiceSpy.sync).not.toHaveBeenCalled();
    });

    it('should return expected css class for status', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        component.issue = {status: IssueStatus.FINISHED};
        expect(component.statusClass()).toBe('status-finished');

        component.issue = {status: IssueStatus.IN_PROGRESS};
        expect(component.statusClass()).toBe('status-progress');

        component.issue = {status: IssueStatus.PENDING};
        expect(component.statusClass()).toBe('status-pending');
    });

    it('should build enum tag class from enum value', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        expect(component.enumTagClass('IN_PROGRESS', 'status')).toBe('status-in-progress');
        expect(component.enumTagClass(undefined, 'status')).toBe('status-unknown');
    });

    it('should not load issue when issueId is missing', () => {
        const routeStubWithoutId = {
            snapshot: {
                paramMap: {
                    get: () => null
                }
            }
        } as unknown as ActivatedRoute;

        const component = new IssueDetailComponent(routeStubWithoutId, issueServiceSpy as any);

        expect(issueServiceSpy.read).not.toHaveBeenCalled();
        expect(component.issue).toBeUndefined();
        expect(component.loading).toBeFalse();
    });

    it('should not load issue when already loading', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);
        component.loading = true;
        issueServiceSpy.read.calls.reset();

        component.loadIssue();

        expect(issueServiceSpy.read).not.toHaveBeenCalled();
    });

    it('should not load issue when issueId is empty string', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);
        component.issueId = '';
        issueServiceSpy.read.calls.reset();

        component.loadIssue();

        expect(issueServiceSpy.read).not.toHaveBeenCalled();
    });

    it('should return status-pending as default for status class', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);
        component.issue = {status: undefined};

        expect(component.statusClass()).toBe('status-pending');
    });

    it('should return status-unknown when issue is undefined', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);
        component.issue = undefined;

        expect(component.statusClass()).toBe('status-pending');
    });

    it('should handle error message with error and message properties in refresh', () => {
        const errorResponse = {error: 'BadRequest', message: 'Invalid input'};
        issueServiceSpy.sync.and.returnValue(throwError(() => errorResponse));
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        component.refresh();

        expect(component.syncing).toBeFalse();
        expect(component.localErrorMessage).toBe('BadRequest: Invalid input');
    });

    it('should handle string error response in refresh', () => {
        const errorResponse = 'Simple error string';
        issueServiceSpy.sync.and.returnValue(throwError(() => errorResponse));
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        component.refresh();

        expect(component.syncing).toBeFalse();
        expect(component.localErrorMessage).toBe('Simple error string');
    });

    it('should handle error with nested message in refresh', () => {
        const errorResponse = {error: {message: 'Nested error'}};
        issueServiceSpy.sync.and.returnValue(throwError(() => errorResponse));
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        component.refresh();

        expect(component.syncing).toBeFalse();
        expect(component.localErrorMessage).toBe('Nested error');
    });

    it('should handle null error response in refresh', () => {
        issueServiceSpy.sync.and.returnValue(throwError(() => null));
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        component.refresh();

        expect(component.syncing).toBeFalse();
        expect(component.localErrorMessage).toBe('No se pudo sincronizar la incidencia.');
    });

    it('should not refresh when already syncing', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);
        component.syncing = true;
        issueServiceSpy.sync.calls.reset();

        component.refresh();

        expect(issueServiceSpy.sync).not.toHaveBeenCalled();
    });

    it('should not refresh when issueId is empty string', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);
        component.issueId = '';
        issueServiceSpy.sync.calls.reset();

        component.refresh();

        expect(issueServiceSpy.sync).not.toHaveBeenCalled();
    });

    it('should clear local error message when loading issue', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);
        component.localErrorMessage = 'Previous error';
        issueServiceSpy.read.calls.reset();

        component.loadIssue();

        expect(component.localErrorMessage).toBeUndefined();
    });

    it('should handle error with only message property in load', () => {
        const errorResponse = {message: 'Load failed'};
        issueServiceSpy.read.and.returnValue(throwError(() => errorResponse));
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        expect(component.localErrorMessage).toBe('Load failed');
    });

    it('should handle unprocessable error response in load', () => {
        const errorResponse = {code: 500};
        issueServiceSpy.read.and.returnValue(throwError(() => errorResponse));
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        expect(component.localErrorMessage).toBe('No se pudo cargar la incidencia.');
    });

    it('should convert multiple underscores in enum tag class', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        expect(component.enumTagClass('IN_PROGRESS_STATE', 'type')).toBe('type-in-progress-state');
    });

    it('should handle enum tag class with lowercase value', () => {
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        expect(component.enumTagClass('bug', 'issue')).toBe('issue-bug');
    });

    it('should extract error message from nested error.message in load', () => {
        const errorResponse = {error: {message: 'Detailed error'}};
        issueServiceSpy.read.and.returnValue(throwError(() => errorResponse));
        const component = new IssueDetailComponent(activatedRouteStub, issueServiceSpy as any);

        expect(component.localErrorMessage).toBe('Detailed error');
    });
});
