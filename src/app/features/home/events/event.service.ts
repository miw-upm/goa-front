import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {EventCreate, EventResponse} from './event.model';

@Injectable()
export class EventService {
    constructor(private readonly httpService: HttpService) {
    }

    findByEngagementLetterId(engagementLetterId: string): Observable<EventResponse[]> {
        return this.httpService.request()
            .get<EventResponse[]>(ENDPOINTS.events.byEngagementLetterId(engagementLetterId));
    }

    create(event: EventCreate): Observable<EventResponse> {
        return this.httpService.request()
            .success('Evento creado correctamente')
            .post<EventResponse>(ENDPOINTS.events.root, event);
    }
}

