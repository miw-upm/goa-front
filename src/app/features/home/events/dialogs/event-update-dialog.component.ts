import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import {of} from 'rxjs';

import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {FormSelectComponent} from '@shared/ui/inputs/forms/form-select.component';
import {EventResponse, EventStatus, EventType, EventUpdate} from '../event.model';
import {EventService} from '../event.service';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatNativeDateModule,
        FormFieldComponent,
        AppDateFieldComponent,
        FormSelectComponent
    ],
    providers: [DatePipe, EventService],
    templateUrl: 'event-update-dialog.component.html',
    styleUrls: ['event-dialog.component.css']
})
export class EventUpdateDialogComponent {
    id: string;
    title: string;
    description: string;
    eventDate: Date | null;
    type: EventType;
    status: EventStatus;

    typeOptions = of(Object.values(EventType));
    statusOptions = of(Object.values(EventStatus));

    constructor(
        @Inject(MAT_DIALOG_DATA) data: EventResponse,
        private readonly eventService: EventService,
        private readonly dialog: MatDialog,
        private readonly datePipe: DatePipe
    ) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.eventDate = data.eventDate ? new Date(data.eventDate) : null;
        this.type = data.type;
        this.status = data.status;
    }

    invalid(): boolean {
        return !this.title?.trim() || !this.type || !this.status;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    update(): void {
        const payload: EventUpdate = {
            eventDate: this.eventDate
                ? this.datePipe.transform(this.eventDate, "yyyy-MM-dd'T'HH:mm:ss") ?? undefined
                : undefined,
            type: this.type,
            title: this.title,
            description: this.description,
            status: this.status
        };
        this.eventService.update(this.id, payload).subscribe(() => this.dialog.closeAll());
    }
}

