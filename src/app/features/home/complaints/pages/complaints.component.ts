import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {of} from 'rxjs';

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
}