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

import {FormFieldComponent} from '@shared/ui/inputs/forms/field.component';
import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {FormSelectComponent} from '@shared/ui/inputs/forms/select.component';
import {EventCreate, EventStatus, EventType} from '../event.model';
import {EventService} from '../event.service';

interface EventCreationData {
    engagementLetterId: string;
}

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
    templateUrl: 'event-creation-dialog.component.html',
    styleUrls: ['event-dialog.component.css']
})
export class EventCreationDialogComponent {
    engagementLetterId: string;
    title: string = undefined;
    description: string = undefined;
    eventDate: Date | null = null;
    type: EventType = undefined;
    status: EventStatus = EventStatus.PENDING;

    typeOptions = of(Object.values(EventType));
    statusOptions = of(Object.values(EventStatus));

    constructor(
        @Inject(MAT_DIALOG_DATA) data: EventCreationData,
        private readonly eventService: EventService,
        private readonly dialog: MatDialog,
        private readonly datePipe: DatePipe
    ) {
        this.engagementLetterId = data.engagementLetterId;
    }

    invalid(): boolean {
        return !this.title?.trim() || !this.type || !this.status;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    create(): void {
        const payload: EventCreate = {
            eventDate: this.eventDate
                ? this.datePipe.transform(this.eventDate, "yyyy-MM-dd'T'HH:mm:ss") ?? undefined
                : undefined,
            type: this.type,
            title: this.title,
            description: this.description,
            status: this.status,
            engagementLetterId: this.engagementLetterId
        };
        this.eventService.create(payload).subscribe(() => this.dialog.closeAll());
    }
}

