import {Router} from '@angular/router';

import {IssuesComponent} from './issues.component';

describe('IssuesComponent', () => {
    let routerSpy: { navigate: jasmine.Spy };

    beforeEach(() => {
        routerSpy = {
            navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true))
        };
    });

    /*it('should navigate to issue detail with trimmed id', () => {
        const component = new IssuesComponent(routerSpy as unknown as Router);
        component.issueId = '  abc-123  ';

        component.goToDetail(component);

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/issues', 'abc-123']);
    });

    it('should not navigate when id is empty', () => {
        const component = new IssuesComponent(routerSpy as unknown as Router);
        component.issueId = '   ';

        component.goToDetail(component);

        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });*/
});
