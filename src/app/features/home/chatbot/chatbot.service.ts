import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpService} from "@shared/ui/api/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {
    ChatbotConfigurationStatus,
    ChatbotConversationType,
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
        type: ChatbotConversationType,
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

    escalateConversation(conversationId: string): Observable<void> {
        return this.httpService.request()
            .error('No se pudo escalar la conversacion')
            .patch<void>(ENDPOINTS.chatbot.escalateConversation(conversationId), {});
    }

    deleteConversation(conversationId: string): Observable<void> {
        return this.httpService.request()
            .error('No se pudo borrar la conversacion')
            .delete(ENDPOINTS.chatbot.deleteConversation(conversationId));
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

    readConfigurationStatus(): Observable<ChatbotConfigurationStatus> {
        return this.httpService.request()
            .error('No se pudo recuperar la configuración del asistente')
            .get(ENDPOINTS.chatbot.configurationStatus());
    }

    sendMessage(request: ChatbotMessageRequest): Observable<ChatbotMessageResponse> {
        return this.httpService.request()
            .error('No se pudo obtener respuesta del asistente')
            .post(ENDPOINTS.chatbot.messages(), request);
    }
}
