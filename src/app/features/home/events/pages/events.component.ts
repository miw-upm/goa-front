import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {EventResponse} from '../event.model';
import {EventService} from '../event.service';
import {EventCreationDialogComponent} from '../dialogs/event-creation-dialog.component';

@Component({
    standalone: true,
    providers: [EventService, DatePipe],
    imports: [CrudComponent, MatButtonModule, MatIconModule],
    templateUrl: 'events.component.html'
})
export class EventsComponent {
    title = 'Eventos de Hoja de Encargo';
    engagementLetterId: string;
    events$: Observable<any[]> = of([]);
    event$: Observable<EventResponse>;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly eventService: EventService,
        private readonly datePipe: DatePipe
    ) {
        this.engagementLetterId = this.route.snapshot.paramMap.get('id');
        this.search();
    }

    search(): void {
        this.events$ = this.eventService.findByEngagementLetterId(this.engagementLetterId).pipe(
            map(events => events.map(ev => ({
                ...ev,
                eventDate: ev.eventDate
                    ? this.datePipe.transform(ev.eventDate, 'dd/MM/yyyy')
                    : null
            })))
        );
    }

    create(): void {
        this.dialog.open(EventCreationDialogComponent, {
            data: {engagementLetterId: this.engagementLetterId},
            width: '600px'
        }).afterClosed().subscribe(() => this.search());
    }

    read(event: EventResponse): void {
        this.event$ = this.eventService.read(event.id);
    }

    goBack(): void {
        void this.router.navigate(['/home/engagement-letters']);
    }
}
