import {of} from 'rxjs';
import {ComplaintCreationDialogComponent} from '../dialogs/complaint-creation-dialog.component';
import {ComplaintsComponent} from './complaints.component';

describe('ComplaintsComponent', () => {
    let dialogSpy: {
        open: jasmine.Spy;
    };

    let complaintServiceSpy: {};

    beforeEach(() => {
        dialogSpy = {
            open: jasmine.createSpy('open').and.returnValue({
                afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
            })
        };

        complaintServiceSpy = {};
    });

    it('should initialize title and empty list', (done) => {
        const component = new ComplaintsComponent(dialogSpy as any, complaintServiceSpy as any);

        expect(component.title).toBe('Quejas');

        component.complaints.subscribe(items => {
            expect(items).toEqual([]);
            done();
        });
    });

    it('should open complaint creation dialog with width 600px', () => {
        const component = new ComplaintsComponent(dialogSpy as any, complaintServiceSpy as any);

        component.create();

        expect(dialogSpy.open).toHaveBeenCalledWith(ComplaintCreationDialogComponent, {width: '600px'});
    });

    it('should call afterClosed on opened dialog', () => {
        const component = new ComplaintsComponent(dialogSpy as any, complaintServiceSpy as any);

        component.create();

        const dialogRef = dialogSpy.open.calls.mostRecent().returnValue;
        expect(dialogRef.afterClosed).toHaveBeenCalled();
    });
});