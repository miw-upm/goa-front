import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {delay} from 'rxjs/operators';

import {ChatbotMessageRequest, ChatbotMessageResponse} from "./models/chatbot.model";

@Injectable({ providedIn: 'root' })
export class ChatbotService {

    sendMessage(request: ChatbotMessageRequest): Observable<ChatbotMessageResponse> {
        return of({
            conversationId: request.conversationId ?? 'local-conversation',
            message: 'Respuesta simulada del asistente',
            createdAt: new Date().toISOString()
        }).pipe(delay(500));
    }
}