import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {HttpService} from "@core/http/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {
    ChatbotConversationMessageResponse,
    ChatbotConversationSummary,
    ChatbotContextualConversationRequest,
    ChatbotContextualConversationResponse,
    ChatbotMessageRequest,
    ChatbotMessageResponse,
    ChatbotMessageView
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

    readAllConversations(): Observable<ChatbotConversationSummary[]> {
        return this.httpService.request()
            .error('No se pudo cargar el histórico de conversaciones')
            .get<ChatbotConversationSummary[]>(ENDPOINTS.chatbot.readAllConversations());
    }

    readMessagesOneConversation(conversationId: string): Observable<ChatbotMessageView[]> {
        return this.httpService.request()
            .error('No se pudieron cargar los mensajes de la conversación')
            .get<ChatbotConversationMessageResponse[]>(ENDPOINTS.chatbot.readMessagesOneConversation(conversationId))
            .pipe(
                map(messages => messages.map(message => ({
                    sender: this.normalizeSender(message.sender),
                    content: message.content ?? message.message ?? '',
                    createdAt: message.createdAt,
                    restricted: !!message.restricted
                })))
            );
    }

    closeConversation(conversationId: string): Observable<void> {
        return this.httpService.request()
            .patch<void>(ENDPOINTS.chatbot.closeConversation(conversationId), {});
    }

    private normalizeSender(sender: string | undefined): 'USER' | 'ASSISTANT' {
        const normalizedSender = sender?.trim().toUpperCase();

        if (!normalizedSender) {
            return 'ASSISTANT';
        }

        if (['USER', 'CLIENT', 'CLIENTE', 'CUSTOMER', 'HUMAN', 'USUARIO'].includes(normalizedSender)) {
            return 'USER';
        }

        if (['ASSISTANT', 'ASISTENTE', 'BOT', 'CHATBOT', 'AI', 'MODEL', 'SYSTEM'].includes(normalizedSender)) {
            return 'ASSISTANT';
        }

        return normalizedSender.includes('USER')
            || normalizedSender.includes('CLIENT')
            || normalizedSender.includes('CUSTOMER')
            || normalizedSender.includes('HUMAN')
            || normalizedSender.includes('USUARIO')
            ? 'USER'
            : 'ASSISTANT';
    }
}
