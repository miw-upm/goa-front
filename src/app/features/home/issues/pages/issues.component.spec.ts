import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IssuesComponent} from './issues.component';
import {IssueService} from '../issue.service';
import {IssueResponse, IssueType, IssueStatus} from '../issue.model';
import {of} from 'rxjs';

describe('IssuesComponent', () => {
    let component: IssuesComponent;
    let routerSpy: { navigate: jasmine.Spy };
    let snackBarSpy: { open: jasmine.Spy };
    let issueServiceSpy: { search: jasmine.Spy; read: jasmine.Spy };

    beforeEach(() => {
        routerSpy = {
            navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true))
        };
        snackBarSpy = {
            open: jasmine.createSpy('open')
        };
        issueServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([])),
            read: jasmine.createSpy('read').and.returnValue(of({}))
        };

        component = new IssuesComponent(
            routerSpy as unknown as Router,
            snackBarSpy as unknown as MatSnackBar,
            issueServiceSpy as unknown as IssueService
        );
    });

    it('should navigate to issue detail with trimmed id', () => {
        const issue: IssueResponse = {
            id: '  abc-123  ',
            title: 'Test Issue',
            type: IssueType.BUG,
            status: IssueStatus.PENDING
        };

        component.goToDetail(issue);

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/issues', 'abc-123']);
    });

    it('should not navigate when id is empty', () => {
        const issue: IssueResponse = {
            id: '   ',
            title: 'Test Issue',
            type: IssueType.BUG,
            status: IssueStatus.PENDING
        };

        component.goToDetail(issue);

        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should search issues with criteria', () => {
        component.search();

        expect(issueServiceSpy.search).toHaveBeenCalled();
    });

    it('should read issue', () => {
        const issue: IssueResponse = {
            id: '123',
            title: 'Test Issue'
        };

        component.read(issue);

        expect(issueServiceSpy.read).toHaveBeenCalledWith('123');
    });
});
