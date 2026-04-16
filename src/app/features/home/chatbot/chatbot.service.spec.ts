import {of} from 'rxjs';

import {ChatbotService} from './chatbot.service';
import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {
    ChatbotContextualConversationRequest,
    ChatbotContextualConversationResponse,
    ChatbotMessageRequest,
    ChatbotMessageResponse
} from './models/chatbot.model';

describe('ChatbotService', () => {
    let service: ChatbotService;
    let httpServiceSpy: jasmine.SpyObj<HttpService>;
    let requestBuilderSpy: {
        error: jasmine.Spy;
        post: jasmine.Spy;
    };

    beforeEach(() => {
        requestBuilderSpy = {
            error: jasmine.createSpy('error'),
            post: jasmine.createSpy('post')
        };

        requestBuilderSpy.error.and.returnValue(requestBuilderSpy);
        requestBuilderSpy.post.and.returnValue(of({
            conversationId: 'conv-1',
            message: 'Respuesta simulada del asistente',
            createdAt: '2026-04-03T00:00:00Z'
        } as ChatbotMessageResponse));

        httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', ['request']);
        httpServiceSpy.request.and.returnValue(requestBuilderSpy as any);

        service = new ChatbotService(httpServiceSpy);
    });

    it('should start contextual conversation using chatbot endpoint', () => {
        const request: ChatbotContextualConversationRequest = {
            engagementLetterId: 'eng-1'
        };
        const expectedResponse: ChatbotContextualConversationResponse = {
            conversationId: 'ctx-1',
            engagementLetterId: 'eng-1',
            error: 'Aviso controlado'
        };
        requestBuilderSpy.post.and.returnValue(of(expectedResponse));

        let response: ChatbotContextualConversationResponse | undefined;

        service.startContextualConversation(request).subscribe(value => {
            response = value;
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.error).toHaveBeenCalledWith('No se pudo iniciar la conversación contextual');
        expect(requestBuilderSpy.post).toHaveBeenCalledWith(ENDPOINTS.chatbot.contextualConversation(), request);
        expect(response).toEqual(expectedResponse);
    });

    it('should send message using chatbot endpoint', () => {
        const request: ChatbotMessageRequest = {
            conversationId: 'conv-1',
            message: 'Hola'
        };

        let response: ChatbotMessageResponse | undefined;

        service.sendMessage(request).subscribe(value => {
            response = value;
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.error).toHaveBeenCalledWith('No se pudo obtener respuesta del asistente');
        expect(requestBuilderSpy.post).toHaveBeenCalledWith(ENDPOINTS.chatbot.messages(), request);
        expect(response).toEqual({
            conversationId: 'conv-1',
            message: 'Respuesta simulada del asistente',
            createdAt: '2026-04-03T00:00:00Z'
        });
    });

    it('should start general conversation using chatbot endpoint', () => {
        const request: ChatbotMessageRequest = {
            message: 'Hola'
        };

        let response: ChatbotMessageResponse | undefined;

        service.startGeneralConversation(request).subscribe(value => {
            response = value;
        });

        expect(httpServiceSpy.request).toHaveBeenCalled();
        expect(requestBuilderSpy.error).toHaveBeenCalledWith('No se pudo obtener respuesta del asistente');
        expect(requestBuilderSpy.post).toHaveBeenCalledWith(ENDPOINTS.chatbot.generalConversation(), request);
        expect(response).toEqual({
            conversationId: 'conv-1',
            message: 'Respuesta simulada del asistente',
            createdAt: '2026-04-03T00:00:00Z'
        });
    });
});
