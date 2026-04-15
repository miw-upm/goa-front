import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@core/http/http.service';
import {Comment} from './comment.model';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private readonly httpService: HttpService) {}


    createComment(eventId: string, content: string): Observable<Comment> {
        return this.httpService.request()
            .success('Comentario creado correctamente')
            .post<Comment>(ENDPOINTS.events.commentsByEventId(eventId), { content });
    }


    getCommentsByEvent(eventId: string): Observable<Comment[]> {
        return this.httpService.request()
            .get<Comment[]>(ENDPOINTS.events.commentsByEventId(eventId));
    }


deleteComment(eventId: string, comment: Comment): Observable<void> {

    const url =
        `${ENDPOINTS.events.commentsByEventId(eventId)}` +
        `?authorId=${comment.authorId}` +
        `&content=${encodeURIComponent(comment.content)}` +
        `&createdDate=${comment.createdDate}`;

    return this.httpService.request()
        .success('Comentario eliminado correctamente')
        .delete(url);
}



}
