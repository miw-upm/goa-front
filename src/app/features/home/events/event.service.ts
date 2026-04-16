import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {EventCreate, EventResponse, EventUpdate} from './event.model';

@Injectable()
export class EventService {
    constructor(private readonly httpService: HttpService) {
    }

    findByEngagementLetterId(engagementLetterId: string): Observable<EventResponse[]> {
        return this.httpService.request()
            .get<EventResponse[]>(ENDPOINTS.events.byEngagementLetterId(engagementLetterId));
    }

    read(id: string): Observable<EventResponse> {
        return this.httpService.request()
            .get<EventResponse>(ENDPOINTS.events.byId(id));
    }

    create(event: EventCreate): Observable<EventResponse> {
        return this.httpService.request()
            .success('Evento creado correctamente')
            .post<EventResponse>(ENDPOINTS.events.root, event);
    }

    update(id: string, event: EventUpdate): Observable<EventResponse> {
        return this.httpService.request()
            .success('Evento actualizado correctamente')
            .put<EventResponse>(ENDPOINTS.events.byId(id), event);
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success('Evento eliminado correctamente')
            .delete(ENDPOINTS.events.byId(id));
    }
}

