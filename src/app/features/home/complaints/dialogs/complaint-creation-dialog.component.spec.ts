import {of} from 'rxjs';
import {ComplaintCreationDialogComponent} from './complaint-creation-dialog.component';
import {Status} from '../models/status.enum';

describe('ComplaintCreationDialogComponent', () => {
    let complaintServiceSpy: { create: jasmine.Spy };
    let engagementLetterServiceSpy: { search: jasmine.Spy };
    let dialogSpy: { closeAll: jasmine.Spy };

    beforeEach(() => {
        complaintServiceSpy = {
            create: jasmine.createSpy('create').and.returnValue(of({}))
        };

        engagementLetterServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([
                {id: 'eng-1'},
                {id: undefined},
                {id: 'eng-2'}
            ]))
        };

        dialogSpy = {
            closeAll: jasmine.createSpy('closeAll')
        };
    });

    it('should load engagement ids from search and filter undefined', (done) => {
        const component = new ComplaintCreationDialogComponent(
            complaintServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );

        component.engagementIds.subscribe(ids => {
            expect(ids).toEqual(['eng-1', 'eng-2']);
            done();
        });
    });

    it('should return false in canCreate when fields are missing', () => {
        const component = new ComplaintCreationDialogComponent(
            complaintServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        // complaint inicializado vacío
        expect(component.canCreate()).toBeFalse();
    });

    it('should return true in canCreate when all fields are valid', () => {
        const component = new ComplaintCreationDialogComponent(
            complaintServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.complaint = {
            engagementId: 'eng-1',
            description: 'Queja valida',
            status: Status.OPEN,
            createdAt: '2026-05-31'
        };

        expect(component.canCreate()).toBeTrue();
    });

    it('should call create service and close dialog when data is valid', () => {
        const component = new ComplaintCreationDialogComponent(
            complaintServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        component.complaint = {
            engagementId: 'eng-1',
            description: 'Queja',
            status: Status.OPEN,
            createdAt: '2026-05-31'
        };

        component.create();

        expect(complaintServiceSpy.create).toHaveBeenCalledWith(component.complaint);
        expect(dialogSpy.closeAll).toHaveBeenCalled();
    });

    it('should not call create service if form is invalid', () => {
        const component = new ComplaintCreationDialogComponent(
            complaintServiceSpy as any,
            engagementLetterServiceSpy as any,
            dialogSpy as any
        );
        // engagementId vacío
        component.complaint.description = 'Descripcion';

        component.create();

        expect(complaintServiceSpy.create).not.toHaveBeenCalled();
    });
});