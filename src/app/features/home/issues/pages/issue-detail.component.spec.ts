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
});
