import {Component, ElementRef, Inject, OnInit, Optional, ViewChild, OnDestroy} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSidenavModule} from "@angular/material/sidenav";
import {AuthService} from "@core/auth/auth.service";
import {CHATBOT_SCOPE_RESTRICTED_REPLIES, CHATBOT_SCOPE_UI} from "../support/chatbot-scope-ui";
import {
    ChatbotConversationHistoryResponse,
    ChatbotConversationSummary,
    ChatbotHistoryMessage,
    ChatbotMessageResponse,
    ChatbotMessageView,
    ChatbotToastView,
    ContextualChatbotDialogData
} from "../models/chatbot.model";
import {ChatbotService} from "../chatbot.service";
import {TextFieldModule} from "@angular/cdk/text-field";
import {Subscription} from "rxjs";

@Component({
    standalone: true,
    selector: "app-chatbot",
    host: {
        '[class.dialog-host]': 'isDialogMode()'
    },
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        TextFieldModule
    ],
    templateUrl: "./chatbot.component.html",
    styleUrls: ["./chatbot.component.css"]
})

export class ChatbotComponent implements OnInit, OnDestroy {
    message = '';
    conversationId?: string;
    loading = false;
    initializing = false;
    closingConversation = false;
    error = '';
    sideBarOpened = false;
    messages: ChatbotMessageView[] = [];
    toasts: ChatbotToastView[] = [];
    historyLoading = false;
    historyItems: ChatbotConversationSummary[] = [];
    selectedConversationId?: string;
    private toastIdSequence = 0;
    private shownToastKeys = new Set<string>();
    private backdropClickSubscription?: Subscription;
    private closingFromDestroy = false;
    private conversationCloseRequested = false;
    conversationStatus: 'ACTIVE' | 'CLOSED' | 'ARCHIVED' = 'ACTIVE';
    @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

    constructor(
        private readonly chatbotService: ChatbotService,
        private readonly authService: AuthService,
        @Optional() @Inject(MAT_DIALOG_DATA) public readonly dialogData: ContextualChatbotDialogData | null,
        @Optional() private readonly dialogRef: MatDialogRef<ChatbotComponent> | null
    ) {
    }

    ngOnInit(): void {
        this.loadHistoryList();

        if (this.dialogRef) {
            this.backdropClickSubscription = this.dialogRef.backdropClick().subscribe(() => {
                this.closeFromModalInteraction();
            });
        }

        if (!this.dialogData?.engagementLetterId) {
            return;
        }

        this.initializing = true;
        this.error = '';

        this.chatbotService.startContextualConversation({
            engagementLetterId: this.dialogData.engagementLetterId
        }).subscribe({
            next: response => {
                this.conversationId = response.conversationId;
                this.selectedConversationId = response.conversationId;
                this.error = response.error ?? '';
                this.initializing = false;
                this.loadHistoryList();
            },
            error: () => {
                this.error = 'No se pudo iniciar la conversación contextual.';
                this.initializing = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.backdropClickSubscription?.unsubscribe();

        if (this.conversationId && !this.conversationCloseRequested) {
            this.closeActiveConversationSilently(true);
        }
    }

    send(): void {
        const normalizedMessage = this.message?.trim();

        if (!normalizedMessage || this.loading || this.initializing || (this.requiresConversation() && !this.conversationId)) {
            return;
        }

        this.error = '';
        this.messages.push({
            sender: 'USER',
            content: normalizedMessage,
            createdAt: new Date().toISOString()
        });
        this.scrollToBottom();

        this.loading = true;
        this.scrollToBottom();

        const request$ = this.conversationId
            ? this.chatbotService.sendMessage({
                conversationId: this.conversationId,
                message: normalizedMessage
            })
            : this.chatbotService.startGeneralConversation({
                message: normalizedMessage
            });

        request$.subscribe({
            next: response => {
                this.conversationId = response.conversationId;
                this.conversationCloseRequested = false;
                this.selectedConversationId = response.conversationId;

                if (response.message) {
                    this.messages.push(this.mapAssistantMessage(response));
                    this.notifyResponseToast(response);
                    this.scrollToBottom();
                }

                if (response.error) {
                    this.error = response.error;
                }

                this.loading = false;
                this.loadHistoryList();
                this.scrollToBottom();
            },
            error: () => {
                this.error = 'No se pudo obtener respuesta del asistente.';
                this.loading = false;
                this.scrollToBottom();
            }
        });

        this.message = '';
    }

    close(): void {
        this.closeFromModalInteraction();
    }

    toggleSidebar(): void {
        this.sideBarOpened = !this.sideBarOpened;
    }

    closeSidebar(): void {
        this.sideBarOpened = false;
    }

    startNewConversation(): void {
        if (this.loading || this.initializing || this.closingConversation) {
            return;
        }

        this.error = '';
        this.message = '';

        if (this.requiresConversation()) {
            if (!this.conversationId) {
                this.messages = [];
                this.selectedConversationId = undefined;
                this.conversationStatus = 'ACTIVE';
                this.initializeNewContextualConversation();
                return;
            }

            this.closingConversation = true;
            this.conversationCloseRequested = true;

            this.chatbotService.closeConversation(this.conversationId).subscribe({
                next: () => {
                    this.closingConversation = false;
                    this.messages = [];
                    this.conversationId = undefined;
                    this.selectedConversationId = undefined;
                    this.conversationStatus = 'ACTIVE';
                    this.conversationCloseRequested = false;
                    this.initializeNewContextualConversation();
                },
                error: () => {
                    this.error = 'No se pudo cerrar la conversación actual antes de crear una nueva.';
                    this.closingConversation = false;
                    this.conversationCloseRequested = false;
                }
            });

            return;
        }

        if (!this.conversationId) {
            this.messages = [];
            this.selectedConversationId = undefined;
            this.conversationStatus = 'ACTIVE';
            this.closeSidebar();
            return;
        }

        this.closingConversation = true;
        this.conversationCloseRequested = true;

        this.chatbotService.closeConversation(this.conversationId).subscribe({
            next: () => {
                this.closingConversation = false;
                this.messages = [];
                this.conversationId = undefined;
                this.selectedConversationId = undefined;
                this.conversationStatus = 'ACTIVE';
                this.conversationCloseRequested = false;
                this.loadHistoryList();
                this.closeSidebar();
                this.scrollToBottom();
            },
            error: () => {
                this.error = 'No se pudo cerrar la conversación actual antes de crear una nueva.';
                this.closingConversation = false;
                this.conversationCloseRequested = false;
            }
        });
    }

    selectConversation(item: ChatbotConversationSummary): void {
        if (this.loading || this.initializing) {
            return;
        }

        this.initializing = true;
        this.error = '';
        this.conversationId = item.conversationId;
        this.selectedConversationId = item.conversationId;

        this.chatbotService.readConversationHistory(item.conversationId).subscribe({
            next: history => {
                this.messages = this.mapHistoryMessages(history);
                this.initializing = false;
                this.closeSidebar();
                this.scrollToBottom();
            },
            error: () => {
                this.error = 'No se pudo recuperar la conversación seleccionada.';
                this.initializing = false;
            }
        });
    }

    historyTitle(): string {
        return this.requiresConversation() ? 'Historial contextual' : 'Historial general';
    }

    historyEmptyLabel(): string {
        return this.requiresConversation()
            ? 'No hay conversaciones contextuales previas para este encargo.'
            : 'No hay conversaciones generales previas.';
    }

    previewLabel(item: ChatbotConversationSummary): string {
        return item.preview?.trim() || 'Sin mensajes todavía';
    }

    isSelectedConversation(item: ChatbotConversationSummary): boolean {
        return this.selectedConversationId === item.conversationId;
    }

    private loadHistoryList(): void {
        this.historyLoading = true;

        this.chatbotService.readConversations(
            this.requiresConversation() ? 'CONTEXTUAL' : 'GENERAL',
            this.dialogData?.engagementLetterId
        ).subscribe({
            next: items => {
                this.historyItems = items;
                this.historyLoading = false;
            },
            error: () => {
                this.historyLoading = false;
            }
        });
    }

    private mapHistoryMessages(history: ChatbotConversationHistoryResponse): ChatbotMessageView[] {
        return history.messages
            .filter(message => message.senderType === 'USER' || message.senderType === 'ASSISTANT')
            .map(message => this.mapHistoryMessage(message));
    }

    private mapHistoryMessage(message: ChatbotHistoryMessage): ChatbotMessageView {
        return {
            sender: message.senderType === 'USER' ? 'USER' : 'ASSISTANT',
            content: message.content,
            createdAt: message.timestamp,
            restricted: message.senderType === 'ASSISTANT'
                ? this.isRestrictedAssistantReply(message.content)
                : false,
            usedPlatformData: false,
            sourcesSummary: [],
            responseMode: undefined
        };
    }

    isDialogMode(): boolean {
        return !!this.dialogRef;
    }

    requiresConversation(): boolean {
        return !!this.dialogData?.engagementLetterId;
    }

    conversationModeLabel(): string {
        return this.authService.isCustomer() ? 'Modo cliente' : 'Modo profesional';
    }

    conversationModeDescription(): string {
        return this.authService.isCustomer()
            ? 'El asistente usará un lenguaje más claro y guiado.'
            : 'El asistente usará un lenguaje más técnico y operativo.';
    }

    composerPlaceholder(): string {
        return this.authService.isCustomer()
            ? 'Escribe tu duda sobre el encargo'
            : 'Escribe tu consulta operativa o técnica';
    }

    hasUserMessages(): boolean {
        return this.messages.some(message => message.sender === 'USER');
    }

    shouldShowIntroCard(): boolean {
        return !this.hasUserMessages() && !this.loading;
    }

    contextActiveLabel(): string | null {
        if (!this.dialogData?.engagementLetterId) {
            return null;
        }

        return `Hoja de encargo ${this.dialogData.engagementLetterId}`;
    }

    closeToast(toastId: number): void {
        this.toasts = this.toasts.filter(toast => toast.id !== toastId);
    }

    private initializeNewContextualConversation(): void {
        this.initializing = true;

        this.chatbotService.startContextualConversation({
            engagementLetterId: this.dialogData!.engagementLetterId
        }).subscribe({
            next: response => {
                this.conversationId = response.conversationId;
                this.selectedConversationId = response.conversationId;
                this.error = response.error ?? '';
                this.initializing = false;
                this.loadHistoryList();
                this.closeSidebar();
                this.scrollToBottom();
            },
            error: () => {
                this.error = 'No se pudo iniciar una nueva conversación contextual.';
                this.initializing = false;
            }
        });
    }

    private closeFromModalInteraction(): void {
        if (!this.dialogRef) {
            return;
        }

        if (!this.requiresConversation() || !this.conversationId || this.closingConversation) {
            this.dialogRef.close();
            return;
        }

        this.closingConversation = true;
        this.conversationCloseRequested = true;

        this.chatbotService.closeConversation(this.conversationId).subscribe({
            next: () => {
                this.closingConversation = false;
                this.dialogRef?.close();
            },
            error: () => {
                this.closingConversation = false;
                this.dialogRef?.close();
            }
        });
    }

    private closeActiveConversationSilently(fromDestroy = false): void {
        if (
            !this.conversationId ||
            this.closingConversation ||
            this.conversationCloseRequested
        ) {
            return;
        }

        this.closingConversation = true;
        this.closingFromDestroy = fromDestroy;
        this.conversationCloseRequested = true;

        this.chatbotService.closeConversation(this.conversationId).subscribe({
            next: () => {
                this.closingConversation = false;
                this.closingFromDestroy = false;
            },
            error: () => {
                this.closingConversation = false;
                this.closingFromDestroy = false;
            }
        });
    }

    private pushToastOnce(
        key: string,
        kind: 'info' | 'success' | 'warning',
        title: string,
        message: string,
        durationMs = 4500
    ): void {
        if (this.shownToastKeys.has(key)) {
            return;
        }

        this.shownToastKeys.add(key);
        this.pushToast(kind, title, message, durationMs);
    }

    private pushToast(
        kind: 'info' | 'success' | 'warning',
        title: string,
        message: string,
        durationMs = 4500
    ): void {
        const id = ++this.toastIdSequence;

        this.toasts = [
            ...this.toasts,
            {id, kind, title, message}
        ];

        window.setTimeout(() => {
            this.closeToast(id);
        }, durationMs);
    }

    private notifyResponseToast(response: ChatbotMessageResponse): void {
        if (response.responseMode === 'CONTEXTUAL_PLATFORM_DATA') {
            this.pushToastOnce(
                'platform-data-response',
                'success',
                'Respuesta contextual',
                'La respuesta se ha apoyado en datos autorizados del caso.'
            );
            return;
        }

        if (response.responseMode === 'CONTEXTUAL_RESTRICTED') {
            this.pushToastOnce(
                'restricted-response',
                'warning',
                'Respuesta restringida',
                'La respuesta ha sido limitada para respetar el ámbito del encargo.',
                5200
            );
        }
    }

    suggestedQuestions(): string[] {
        if (this.requiresConversation()) {
            return this.authService.isCustomer()
                ? [
                    '¿Cuál es el estado de mi encargo?',
                    '¿Qué pasos siguen ahora?',
                    '¿Hay hitos recientes en mi caso?'
                ]
                : [
                    'Necesito conocer el estado del encargo',
                    '¿Qué hitos recientes tiene este caso?',
                    '¿Cuáles son los próximos pasos visibles?'
                ];
        }

        return this.authService.isCustomer()
            ? [
                '¿Qué tipo de dudas puedes resolver?',
                '¿Cómo puedo consultar el estado de mi encargo?',
                '¿Cómo sé cuáles son los próximos pasos?'
            ]
            : [
                '¿Qué consultas frecuentes puedes resolver?',
                '¿Cómo obtengo el estado de un encargo?',
                '¿Cómo consultar próximos pasos de un caso?'
            ];
    }

    applySuggestedQuestion(question: string): void {
        if (this.loading || this.initializing) {
            return;
        }

        this.message = question;
    }

    onKeydown(event: KeyboardEvent): void {
        if (event.key !== 'Enter' || event.shiftKey) {
            return;
        }

        event.preventDefault();
        this.send();
    }

    assistantModeLabel(item: ChatbotMessageView): string | null {
        if (item.sender !== 'ASSISTANT') {
            return null;
        }

        switch (item.responseMode) {
            case 'GENERAL':
                return 'Respuesta general';
            case 'CONTEXTUAL_PLATFORM_DATA':
                return 'Respuesta contextual';
            case 'CONTEXTUAL_RESTRICTED':
                return 'Respuesta restringida';
            default:
                return null;
        }
    }

    scopeTitle(): string {
        return this.requiresConversation()
            ? CHATBOT_SCOPE_UI.contextual.title
            : CHATBOT_SCOPE_UI.general.title;
    }

    scopeDescription(): string {
        return this.requiresConversation()
            ? CHATBOT_SCOPE_UI.contextual.description
            : CHATBOT_SCOPE_UI.general.description;
    }

    isRestrictedAssistantReply(message: string | undefined): boolean {
        if (!message) {
            return false;
        }

        return CHATBOT_SCOPE_RESTRICTED_REPLIES.includes(message as typeof CHATBOT_SCOPE_RESTRICTED_REPLIES[number]);
    }

    private mapAssistantMessage(response: ChatbotMessageResponse): ChatbotMessageView {
        return {
            sender: 'ASSISTANT',
            content: response.message ?? '',
            createdAt: response.createdAt,
            restricted: this.isRestrictedAssistantReply(response.message),
            usedPlatformData: response.usedPlatformData ?? false,
            sourcesSummary: response.sourcesSummary ?? [],
            responseMode: response.responseMode
        };
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            const container = this.messagesContainer?.nativeElement;

            if (!container) {
                return;
            }

            container.scrollTop = container.scrollHeight;
        });
    }
}
