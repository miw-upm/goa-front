import {fakeAsync, tick} from '@angular/core/testing';

import {ChatbotService} from './chatbot.service';

describe('ChatbotService', () => {
    let service: ChatbotService;

    beforeEach(() => {
        service = new ChatbotService();
    });

    it('should return a mock chatbot response', fakeAsync(() => {
        let response: any;

        service.sendMessage({
            conversationId: 'conv-1',
            message: 'Hola'
        }).subscribe(value => {
            response = value;
        });

        tick(500);

        expect(response).toBeTruthy();
        expect(response.conversationId).toBe('conv-1');
        expect(response.message).toBe('Respuesta simulada del asistente');
        expect(response.createdAt).toBeTruthy();
    }));

    it('should create a local conversation id when none is provided', fakeAsync(() => {
        let response: any;

        service.sendMessage({
            message: 'Hola'
        }).subscribe(value => {
            response = value;
        });

        tick(500);

        expect(response).toBeTruthy();
        expect(response.conversationId).toBe('local-conversation');
    }));
});