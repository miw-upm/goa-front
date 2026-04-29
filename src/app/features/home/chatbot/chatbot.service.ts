import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {HttpService} from "@shared/ui/api/http.service";
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

@Injectable({providedIn: 'root'})
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
                map((messages: ChatbotConversationMessageResponse[]) =>
                    messages.map((message: ChatbotConversationMessageResponse) => this.toChatbotMessageView(message))
                )
            );
    }

    closeConversation(conversationId: string): Observable<void> {
        return this.httpService.request()
            .patch<void>(ENDPOINTS.chatbot.closeConversation(conversationId), {});
    }

    private toChatbotMessageView(message: ChatbotConversationMessageResponse): ChatbotMessageView {
        return {
            sender: this.toSenderType(message.senderType),
            content: message.content ?? '',
            createdAt: message.createdAt,
            restricted: Boolean(message.restricted)
        };
    }

    private toSenderType(senderType?: string): 'USER' | 'ASSISTANT' {
        return senderType === 'USER' ? 'USER' : 'ASSISTANT';
    }
}
