import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpService} from "@shared/ui/api/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {
    ChatbotContextualConversationRequest,
    ChatbotContextualConversationResponse,
    ChatbotConversationHistoryResponse,
    ChatbotConversationSummary,
    ChatbotMessageRequest,
    ChatbotMessageResponse
} from "./models/chatbot.model";

@Injectable({providedIn: 'root'})
export class ChatbotService {
    constructor(private readonly httpService: HttpService) {
    }

    readConversations(
        type: 'GENERAL' | 'CONTEXTUAL',
        engagementLetterId?: string
    ): Observable<ChatbotConversationSummary[]> {
        let request = this.httpService.request()
            .param('type', type)
            .error('No se pudo recuperar el historial de conversaciones');

        if (engagementLetterId) {
            request = request.param('engagementLetterId', engagementLetterId);
        }

        return request.get(ENDPOINTS.chatbot.conversations());
    }

    startGeneralConversation(request: ChatbotMessageRequest): Observable<ChatbotMessageResponse> {
        return this.httpService.request()
            .error('No se pudo iniciar la conversación general')
            .post(ENDPOINTS.chatbot.generalConversation(), request);
    }

    startContextualConversation(
        request: ChatbotContextualConversationRequest
    ): Observable<ChatbotContextualConversationResponse> {
        return this.httpService.request()
            .error('No se pudo iniciar la conversación contextual')
            .post(ENDPOINTS.chatbot.contextualConversation(), request);
    }

    closeConversation(conversationId: string): Observable<void> {
        return this.httpService.request()
            .patch<void>(ENDPOINTS.chatbot.closeConversation(conversationId), {});
    }

    readConversationHistory(
        conversationId: string,
        page = 0,
        size = 10
    ): Observable<ChatbotConversationHistoryResponse> {
        return this.httpService.request()
            .param('page', String(page))
            .param('size', String(size))
            .error('No se pudo recuperar el historial conversacional')
            .get(ENDPOINTS.chatbot.history(conversationId));
    }

    reopenConversation(conversationId: string): Observable<void> {
        return this.httpService.request()
            .patch<void>(ENDPOINTS.chatbot.reopenConversation(conversationId), {});
    }

    sendMessage(request: ChatbotMessageRequest): Observable<ChatbotMessageResponse> {
        return this.httpService.request()
            .error('No se pudo obtener respuesta del asistente')
            .post(ENDPOINTS.chatbot.messages(), request);
    }
}