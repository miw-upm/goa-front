import {of, throwError} from 'rxjs';
import {fakeAsync, tick} from '@angular/core/testing';

import {ChatbotComponent} from './chatbot.component';
import {ChatbotService} from '../chatbot.service';
import {ContextualChatbotDialogData} from '../models/chatbot.model';

describe('ChatbotComponent', () => {
    let chatbotServiceSpy: {
        startContextualConversation: jasmine.Spy;
        startGeneralConversation: jasmine.Spy;
        sendMessage: jasmine.Spy;
    };
    let dialogRefSpy: {
        close: jasmine.Spy;
    };

    const createComponent = (
        dialogData: ContextualChatbotDialogData | null = null,
        dialogRef: { close: jasmine.Spy } | null = null
    ) => new ChatbotComponent(
        chatbotServiceSpy as unknown as ChatbotService,
        dialogData,
        dialogRef as any
    );

    beforeEach(() => {
        chatbotServiceSpy = {
            startContextualConversation: jasmine.createSpy('startContextualConversation'),
            startGeneralConversation: jasmine.createSpy('startGeneralConversation'),
            sendMessage: jasmine.createSpy('sendMessage')
        };
        dialogRefSpy = {
            close: jasmine.createSpy('close')
        };
    });

    it('should not send when message is empty', () => {
        const component = createComponent();
        component.message = '   ';

        component.send();

        expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
        expect(component.messages.length).toBe(0);
    });

    it('should initialize contextual conversation when dialog data is provided', () => {
        chatbotServiceSpy.startContextualConversation.and.returnValue(of({
            conversationId: 'ctx-1',
            error: 'Aviso controlado'
        }));
        const component = createComponent({engagementLetterId: 'eng-1'});

        component.ngOnInit();

        expect(chatbotServiceSpy.startContextualConversation).toHaveBeenCalledWith({
            engagementLetterId: 'eng-1'
        });
        expect(component.conversationId).toBe('ctx-1');
        expect(component.error).toBe('Aviso controlado');
        expect(component.initializing).toBeFalse();
    });

    it('should initialize general conversation without dialog data', () => {
        const component = createComponent();

        component.ngOnInit();

        expect(chatbotServiceSpy.startContextualConversation).not.toHaveBeenCalled();
        expect(chatbotServiceSpy.startGeneralConversation).not.toHaveBeenCalled();
        expect(component.initializing).toBeFalse();
    });

    it('should set initialization error when contextual conversation fails', () => {
        chatbotServiceSpy.startContextualConversation.and.returnValue(throwError(() => new Error('fail')));
        const component = createComponent({engagementLetterId: 'eng-1'});

        component.ngOnInit();

        expect(component.error).toBe('No se pudo iniciar la conversación contextual.');
        expect(component.initializing).toBeFalse();
    });

    it('should start general conversation on first general message and append assistant response', () => {
        chatbotServiceSpy.startGeneralConversation.and.returnValue(of({
            conversationId: 'conv-1',
            message: 'Respuesta simulada del asistente',
            createdAt: '2026-03-26T10:00:00Z'
        }));

        const component = createComponent();
        component.message = 'Hola chatbot';

        component.send();

        expect(chatbotServiceSpy.startGeneralConversation).toHaveBeenCalledWith({
            message: 'Hola chatbot'
        });
        expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();

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

    it('should send message on existing conversation and append assistant response', () => {
        chatbotServiceSpy.sendMessage.and.returnValue(of({
            conversationId: 'conv-2',
            message: 'Respuesta simulada del asistente',
            createdAt: '2026-03-26T10:00:00Z'
        }));

        const component = createComponent();
        component.conversationId = 'conv-1';
        component.message = 'Hola chatbot';

        component.send();

        expect(chatbotServiceSpy.sendMessage).toHaveBeenCalledWith({
            conversationId: 'conv-1',
            message: 'Hola chatbot'
        });
        expect(chatbotServiceSpy.startGeneralConversation).not.toHaveBeenCalled();
        expect(component.conversationId).toBe('conv-2');
        expect(component.messages.length).toBe(2);
        expect(component.loading).toBeFalse();
    });

    it('should set error when general start fails', () => {
        chatbotServiceSpy.startGeneralConversation.and.returnValue(throwError(() => new Error('fail')));

        const component = createComponent();
        component.message = 'Hola chatbot';

        component.send();

        expect(chatbotServiceSpy.startGeneralConversation).toHaveBeenCalled();
        expect(component.error).toBe('No se pudo obtener respuesta del asistente.');
        expect(component.loading).toBeFalse();
    });

    it('should set error when send message fails', () => {
        chatbotServiceSpy.sendMessage.and.returnValue(throwError(() => new Error('fail')));

        const component = createComponent();
        component.conversationId = 'conv-1';
        component.message = 'Hola chatbot';

        component.send();

        expect(chatbotServiceSpy.sendMessage).toHaveBeenCalled();
        expect(component.error).toBe('No se pudo obtener respuesta del asistente.');
        expect(component.loading).toBeFalse();
    });

    it('should not send when loading is true', () => {
        const component = createComponent();
        component.message = 'Hola';
        component.loading = true;

        component.send();

        expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
    });

    it('should not send when initializing is true', () => {
        const component = createComponent();
        component.message = 'Hola';
        component.initializing = true;

        component.send();

        expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
    });

    it('should not send message before conversation exists', () => {
        const component = createComponent({engagementLetterId: 'eng-1'});
        component.message = 'Hola';

        component.send();

        expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
        expect(chatbotServiceSpy.startGeneralConversation).not.toHaveBeenCalled();
        expect(component.messages.length).toBe(0);
    });

    it('should set error when response contains error message', () => {
        chatbotServiceSpy.sendMessage.and.returnValue(of({
            conversationId: 'conv-1',
            error: 'Respuesta con error controlado',
            createdAt: '2026-03-30T10:00:00Z'
        }));

        const component = createComponent();
        component.conversationId = 'conv-1';
        component.message = 'Hola chatbot';

        component.send();

        expect(chatbotServiceSpy.sendMessage).toHaveBeenCalledWith({
            conversationId: 'conv-1',
            message: 'Hola chatbot'
        });
        expect(component.conversationId).toBe('conv-1');
        expect(component.error).toBe('Respuesta con error controlado');
        expect(component.loading).toBeFalse();
    });

    it('should keep only user message when assistant response has no message', () => {
        chatbotServiceSpy.sendMessage.and.returnValue(of({
            conversationId: 'conv-2',
            createdAt: '2026-03-30T10:00:00Z'
        }));
        const component = createComponent();
        component.conversationId = 'conv-1';
        component.message = 'Hola chatbot';

        component.send();

        expect(component.messages.length).toBe(1);
        expect(component.messages[0].sender).toBe('USER');
        expect(component.conversationId).toBe('conv-2');
        expect(component.loading).toBeFalse();
    });

    it('should close dialog when available', () => {
        const component = createComponent(null, dialogRefSpy);

        component.close();

        expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('should report dialog mode based on dialog ref presence', () => {
        expect(createComponent().isDialogMode()).toBeFalse();
        expect(createComponent(null, dialogRefSpy).isDialogMode()).toBeTrue();
    });

    it('should require conversation only when engagement letter id exists', () => {
        expect(createComponent().requiresConversation()).toBeFalse();
        expect(createComponent({engagementLetterId: 'eng-1'}).requiresConversation()).toBeTrue();
    });

    it('should scroll messages container to bottom when available', fakeAsync(() => {
        const component = createComponent();
        const container = {
            scrollTop: 0,
            scrollHeight: 320
        };

        (component as any).messagesContainer = {
            nativeElement: container
        };

        (component as any).scrollToBottom();
        tick();

        expect(container.scrollTop).toBe(320);
    }));
});
