import {of, throwError} from 'rxjs';

import {ChatbotComponent} from './chatbot.component';
import {ChatbotService} from '../chatbot.service';

describe('ChatbotComponent', () => {
    let chatbotServiceSpy: {
        sendMessage: jasmine.Spy;
    };

    beforeEach(() => {
        chatbotServiceSpy = {
            sendMessage: jasmine.createSpy('sendMessage')
        };
    });

    it('should not send when message is empty', () => {
        const component = new ChatbotComponent(chatbotServiceSpy as unknown as ChatbotService);
        component.message = '   ';

        component.send();

        expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
        expect(component.messages.length).toBe(0);
    });

    it('should send user message and append assistant response', () => {
        chatbotServiceSpy.sendMessage.and.returnValue(of({
            conversationId: 'conv-1',
            message: 'Respuesta simulada del asistente',
            createdAt: '2026-03-26T10:00:00Z'
        }));

        const component = new ChatbotComponent(chatbotServiceSpy as unknown as ChatbotService);
        component.message = 'Hola chatbot';

        component.send();

        expect(chatbotServiceSpy.sendMessage).toHaveBeenCalledWith({
            conversationId: undefined,
            message: 'Hola chatbot'
        });

        expect(component.messages.length).toBe(2);
        expect(component.messages[0]).toEqual({
            sender: 'USER',
            content: 'Hola chatbot',
            createdAt: jasmine.any(String) as any
        });
        expect(component.messages[1]).toEqual({
            sender: 'ASSISTANT',
            content: 'Respuesta simulada del asistente',
            createdAt: '2026-03-26T10:00:00Z'
        });
        expect(component.conversationId).toBe('conv-1');
        expect(component.message).toBe('');
        expect(component.loading).toBeFalse();
        expect(component.error).toBe('');
    });

    it('should set error when service fails', () => {
        chatbotServiceSpy.sendMessage.and.returnValue(throwError(() => new Error('fail')));

        const component = new ChatbotComponent(chatbotServiceSpy as unknown as ChatbotService);
        component.message = 'Hola chatbot';

        component.send();

        expect(chatbotServiceSpy.sendMessage).toHaveBeenCalled();
        expect(component.error).toBe('No se pudo obtener respuesta del asistente.');
        expect(component.loading).toBeFalse();
    });

    it('should not send when loading is true', () => {
        const component = new ChatbotComponent(chatbotServiceSpy as unknown as ChatbotService);
        component.message = 'Hola';
        component.loading = true;

        component.send();

        expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
    });

    it('should set error when response contains error message', () => {
        chatbotServiceSpy.sendMessage.and.returnValue(of({
            conversationId: 'conv-1',
            error: 'Respuesta con error controlado',
            createdAt: '2026-03-30T10:00:00Z'
        }));

        const component = new ChatbotComponent(chatbotServiceSpy as unknown as ChatbotService);
        component.message = 'Hola chatbot';

        component.send();

        expect(chatbotServiceSpy.sendMessage).toHaveBeenCalledWith({
            conversationId: undefined,
            message: 'Hola chatbot'
        });
        expect(component.conversationId).toBe('conv-1');
        expect(component.error).toBe('Respuesta con error controlado');
        expect(component.loading).toBeFalse();
    });
});
