import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {Complaint} from '../models/complaint.model';
import {ComplaintService} from '../complaint.service';
import {ComplaintCreationDialogComponent} from '../dialogs/complaint-creation-dialog.component';

@Component({
    standalone: true,
    selector: 'app-complaints',
    imports: [CrudComponent],
    templateUrl: 'complaints.component.html'
})
export class ComplaintsComponent {
    title = 'Quejas';
    complaints = of([] as Complaint[]);
    complaint: Observable<Complaint>;

    constructor(
        private readonly dialog: MatDialog,
        private readonly complaintService: ComplaintService
    ) {
    }

    search(): void {
        this.complaints = this.complaintService.search();
    }

    create(): void {
        this.dialog.open(ComplaintCreationDialogComponent, {width: '600px'})
            .afterClosed()
            .subscribe(() => {
                // recargar los datos si fuera necesario
                // this.complaints = this.complaintService.readAll();
            });
    }

    read(complaint: Complaint): void {
        this.complaint = this.complaintService.read(complaint.id);
    }

    update(complaint: Complaint): void {
        if (!complaint.id) {
            return;
        }

        this.dialog.open(ComplaintCreationDialogComponent, {
            width: '600px',
            data: complaint
        }).afterClosed()
            .subscribe(() => this.search());
    }

}