import {of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';

import {CrudComponent} from './crud.component';
import {ReadDetailDialogComponent} from './read-detail.dialog.component';

describe('CrudComponent', () => {
    let dialogSpy: {
        open: jasmine.Spy;
    };

    beforeEach(() => {
        dialogSpy = {
            open: jasmine.createSpy('open')
        };
    });

    it('should ignore undefined item input', () => {
        const component = new CrudComponent(dialogSpy as unknown as MatDialog);

        expect(() => {
            component.item = undefined;
        }).not.toThrow();

        expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it('should open detail dialog when item input emits', () => {
        const component = new CrudComponent(dialogSpy as unknown as MatDialog);
        component.title = 'Users';

        component.item = of({id: '1', name: 'Alice'});

        expect(dialogSpy.open).toHaveBeenCalledWith(ReadDetailDialogComponent, {
            data: {
                title: 'Details of Users',
                object: {id: '1', name: 'Alice'}
            }
        });
    });
});
