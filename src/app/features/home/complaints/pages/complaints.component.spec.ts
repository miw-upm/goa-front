import {of} from 'rxjs';
import {ComplaintCreationDialogComponent} from '../dialogs/complaint-creation-dialog.component';
import {ComplaintsComponent} from './complaints.component';
import {Complaint} from '../models/complaint.model';
import {Status} from "../models/status.enum";

describe('ComplaintsComponent', () => {
    let dialogSpy: {
        open: jasmine.Spy;
    };

    let complaintServiceSpy: {
        search: jasmine.Spy;
        read: jasmine.Spy;
    };

    beforeEach(() => {
        dialogSpy = {
            open: jasmine.createSpy('open').and.returnValue({
                afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
            })
        };

        complaintServiceSpy = {
            search: jasmine.createSpy('search').and.returnValue(of([])),
            read: jasmine.createSpy('read').and.returnValue(of({
                id: '11111111-1111-1111-1111-111111111111',
                engagementId: '22222222-2222-2222-2222-222222222222',
                mobile: '600123456',
                description: 'Test Complaint',
                status: Status.OPEN,
                createdAt: '2026-03-24T10:00:00'
            }))
        };
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

    it('should call search on complaint service', () => {
        const component = new ComplaintsComponent(dialogSpy as any, complaintServiceSpy as any);

        component.search();

        expect((complaintServiceSpy as any).search).toHaveBeenCalled();
    });

    it('should update complaints on search', (done) => {
        const expectedComplaints: Complaint[] = [{
            id: '11111111-1111-1111-1111-111111111111',
            engagementId: '22222222-2222-2222-2222-222222222222',
            mobile: '600123456',
            description: 'Test Complaint',
            status: Status.OPEN,
            createdAt: '2026-03-24T10:00:00'
        }];

        complaintServiceSpy.search.and.returnValue(of(expectedComplaints));
        const component = new ComplaintsComponent(dialogSpy as any, complaintServiceSpy as any);

        component.search();

        component.complaints.subscribe(items => {
            expect(items).toEqual(expectedComplaints);
            done();
        });
    });

    it('should call read on complaint service with selected id', () => {
        const component = new ComplaintsComponent(dialogSpy as any, complaintServiceSpy as any);
        const complaint: Complaint = {
            id: 'complaint-1',
            engagementId: 'eng-1',
            mobile: '600123456',
            description: 'Hotel issue',
            status: Status.OPEN,
            createdAt: '2026-03-25T10:00:00'
        };

        component.read(complaint);

        expect(complaintServiceSpy.read).toHaveBeenCalledWith('complaint-1');
    });

    it('should update complaint item on read', (done) => {
        const expectedComplaint: Complaint = {
            id: 'complaint-1',
            engagementId: 'eng-1',
            mobile: '600123456',
            description: 'Hotel issue',
            status: Status.OPEN,
            createdAt: '2026-03-25T10:00:00'
        };
        complaintServiceSpy.read.and.returnValue(of(expectedComplaint));
        const component = new ComplaintsComponent(dialogSpy as any, complaintServiceSpy as any);

        component.read(expectedComplaint);

        component.complaint.subscribe(item => {
            expect(item).toEqual(expectedComplaint);
            done();
        });
    });
});