import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@core/http/http.service';
import {EventComment} from './comment.model';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    constructor(private readonly httpService: HttpService) {
    }

    createComment(eventId: string, content: string): Observable<EventComment> {
        return this.httpService.request()
            .success('Comentario creado correctamente')
            .post<EventComment>(ENDPOINTS.events.commentsByEventId(eventId), {content});
    }

    getCommentsByEvent(eventId: string): Observable<EventComment[]> {
        return this.httpService.request()
            .get<EventComment[]>(ENDPOINTS.events.commentsByEventId(eventId));
    }
}
