import {of, throwError} from 'rxjs';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ChatbotComponent} from './chatbot.component';
import {ChatbotService} from '../chatbot.service';
import {ContextualChatbotDialogData} from '../models/chatbot.model';
import {AuthService} from '@core/auth/auth.service';
import {CHATBOT_SCOPE_RESTRICTED_REPLIES, CHATBOT_SCOPE_UI} from '../support/chatbot-scope-ui';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('ChatbotComponent', () => {
    let chatbotServiceSpy: {
        startContextualConversation: jasmine.Spy;
        startGeneralConversation: jasmine.Spy;
        sendMessage: jasmine.Spy;
    };
    let authServiceSpy: {
        isCustomer: jasmine.Spy;
    };
    let dialogRefSpy: {
        close: jasmine.Spy;
    };

    const createComponent = (
        dialogData: ContextualChatbotDialogData | null = null,
        dialogRef: { close: jasmine.Spy } | null = null
    ) => new ChatbotComponent(
        chatbotServiceSpy as unknown as ChatbotService,
        authServiceSpy as unknown as AuthService,
        dialogData,
        dialogRef as any
    );

    const createRenderedComponent = (
        dialogData: ContextualChatbotDialogData | null = null
    ): ComponentFixture<ChatbotComponent> => {
        TestBed.configureTestingModule({
            imports: [ChatbotComponent],
            providers: [
                {provide: ChatbotService, useValue: chatbotServiceSpy},
                {provide: AuthService, useValue: authServiceSpy},
                {provide: MAT_DIALOG_DATA, useValue: dialogData},
                {provide: MatDialogRef, useValue: null}
            ]
        });

        return TestBed.createComponent(ChatbotComponent);
    };

    beforeEach(() => {
        chatbotServiceSpy = {
            startContextualConversation: jasmine.createSpy('startContextualConversation'),
            startGeneralConversation: jasmine.createSpy('startGeneralConversation'),
            sendMessage: jasmine.createSpy('sendMessage')
        };
        authServiceSpy = {
            isCustomer: jasmine.createSpy('isCustomer').and.returnValue(false)
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
            engagementLetterId: 'eng-1',
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

    it('should clear contextual initialization error when response has no error', () => {
        chatbotServiceSpy.startContextualConversation.and.returnValue(of({
            conversationId: 'ctx-1',
            engagementLetterId: 'eng-1'
        }));
        const component = createComponent({engagementLetterId: 'eng-1'});
        component.error = 'Error previo';

        component.ngOnInit();

        expect(component.conversationId).toBe('ctx-1');
        expect(component.error).toBe('');
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
            createdAt: '2026-03-26T10:00:00Z',
            restricted: false
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

    it('should expose customer conversation copy when user is customer', () => {
        authServiceSpy.isCustomer.and.returnValue(true);
        const component = createComponent();

        expect(component.conversationModeLabel()).toBe('Modo cliente');
        expect(component.conversationModeDescription()).toBe('El asistente usará un lenguaje más claro y guiado.');
        expect(component.composerPlaceholder()).toBe('Escribe tu duda sobre el encargo');
    });

    it('should expose professional conversation copy when user is not customer', () => {
        authServiceSpy.isCustomer.and.returnValue(false);
        const component = createComponent();

        expect(component.conversationModeLabel()).toBe('Modo profesional');
        expect(component.conversationModeDescription()).toBe('El asistente usará un lenguaje más técnico y operativo.');
        expect(component.composerPlaceholder()).toBe('Escribe tu consulta operativa o técnica');
    });

    it('should show general scope banner when there is no engagement context', () => {
        const fixture = createRenderedComponent();

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const scopeBanner = compiled.querySelector('.scope-banner');

        expect(scopeBanner).toBeTruthy();
        expect(scopeBanner?.textContent).toContain(CHATBOT_SCOPE_UI.general.title);
        expect(scopeBanner?.textContent).toContain('Este chat ofrece orientación general y ayuda de uso de la plataforma.');
    });

    it('should show contextual scope banner when there is engagement context', () => {
        chatbotServiceSpy.startContextualConversation.and.returnValue(of({
            conversationId: 'ctx-1',
            engagementLetterId: 'eng-123'
        }));
        const fixture = createRenderedComponent({engagementLetterId: 'eng-123'});

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const scopeBanner = compiled.querySelector('.scope-banner');

        expect(scopeBanner).toBeTruthy();
        expect(scopeBanner?.textContent).toContain(CHATBOT_SCOPE_UI.contextual.title);
        expect(scopeBanner?.textContent).toContain('Este chat está limitado a la hoja de encargo activa');
    });

    it('should detect restricted assistant replies', () => {
        const restrictedMessage = CHATBOT_SCOPE_RESTRICTED_REPLIES[1];
        const normalMessage = 'Mensaje recibido. La integración actual sigue siendo simulada, pero la respuesta se orienta a soporte operativo y gestión del encargo.';
        const component = createComponent();

        expect(component.isRestrictedAssistantReply(restrictedMessage)).toBeTrue();
        expect(component.isRestrictedAssistantReply(normalMessage)).toBeFalse();
        expect(component.isRestrictedAssistantReply(undefined)).toBeFalse();
    });

    it('should render restricted class for restricted assistant messages', () => {
        const restrictedMessage = CHATBOT_SCOPE_RESTRICTED_REPLIES[1];
        const fixture = createRenderedComponent();

        fixture.componentInstance.messages = [
            {
                sender: 'ASSISTANT',
                content: restrictedMessage,
                restricted: true
            }
        ];

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const message = compiled.querySelector('.message.assistant.restricted');

        expect(message).toBeTruthy();
        expect(message?.textContent).toContain('Solo puedo responder dentro del ámbito del encargo activo');
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
