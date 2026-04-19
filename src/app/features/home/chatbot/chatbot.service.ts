import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpService} from "@core/http/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {
    ChatbotContextualConversationRequest,
    ChatbotContextualConversationResponse,
    ChatbotMessageRequest,
    ChatbotMessageResponse
} from "./models/chatbot.model";

@Injectable({ providedIn: 'root' })
export class ChatbotService {

    constructor(private readonly httpService: HttpService) {
    }

    startContextualConversation(
        request: ChatbotContextualConversationRequest
    ): Observable<ChatbotContextualConversationResponse> {
        return this.httpService.request()
            .error('No se pudo iniciar la conversación contextual')
            .post(ENDPOINTS.chatbot.contextualConversation(), request);
    }

    sendMessage(request: ChatbotMessageRequest): Observable<ChatbotMessageResponse> {
        return this.httpService.request()
            .error('No se pudo obtener respuesta del asistente')
            .post(ENDPOINTS.chatbot.messages(), request);
    }

    startGeneralConversation(request: ChatbotMessageRequest): Observable<ChatbotMessageResponse> {
        return this.httpService.request()
            .error('No se pudo obtener respuesta del asistente')
            .post(ENDPOINTS.chatbot.generalConversation(), request);
    }

    closeConversation(conversationId: string): Observable<void> {
        return this.httpService.request()
            .patch<void>(ENDPOINTS.chatbot.closeConversation(conversationId), {});
    }
}
