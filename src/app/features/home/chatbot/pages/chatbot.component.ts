import {Component, ElementRef, Inject, OnInit, Optional, ViewChild, OnDestroy, HostListener} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";
import {MatSidenavModule} from "@angular/material/sidenav";
import {AuthService} from "@core/auth/auth.service";
import {CHATBOT_SCOPE_RESTRICTED_REPLIES, CHATBOT_SCOPE_UI} from "../support/chatbot-scope-ui";
import {
    ChatbotConfigurationStatus,
    ChatbotConversationStatus,
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
import {forkJoin, of, Subscription} from "rxjs";
import {catchError} from "rxjs/operators";
import {CancelYesDialogComponent} from "@shared/ui/dialogs/cancel-yes-dialog.component";

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
    private static readonly HISTORY_PAGE_SIZE = 10;
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
    historyError = '';
    historyItems: ChatbotConversationSummary[] = [];
    deletingConversationId?: string;
    loadingOlderMessages = false;
    hasMoreHistoryMessages = false;
    currentHistoryPage = 0;
    private allowHistoryIncrementalLoad = false;
    selectedConversationId?: string;
    private toastIdSequence = 0;
    private shownToastKeys = new Set<string>();
    private autoScrollTimeouts: number[] = [];
    private backdropClickSubscription?: Subscription;
    private modalCloseRequested = false;
    conversationStatus: ChatbotConversationStatus = 'ACTIVE';
    configurationStatus?: ChatbotConfigurationStatus;
    @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;
    @ViewChild('composerTextarea') private composerTextarea?: ElementRef<HTMLTextAreaElement>;

    constructor(
        private readonly chatbotService: ChatbotService,
        private readonly authService: AuthService,
        private readonly dialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) public readonly dialogData: ContextualChatbotDialogData | null,
        @Optional() private readonly dialogRef: MatDialogRef<ChatbotComponent> | null
    ) {
    }

    ngOnInit(): void {
        this.loadConfigurationStatus();
        this.loadHistoryList();

        if (this.dialogRef) {
            this.backdropClickSubscription = this.dialogRef.backdropClick().subscribe(() => {
                this.closeFromModalInteraction();
            });
        }
    }

    ngOnDestroy(): void {
        this.backdropClickSubscription?.unsubscribe();
        this.cancelPendingAutoScroll();
        if (this.modalCloseRequested) {
            return;
        }
        this.closeAllActiveConversationsSilently();
    }

    @HostListener('window:beforeunload')
    onBeforeUnload(): void {
        this.closeAllActiveConversationsSilently();
    }

    send(): void {
        const normalizedMessage = this.message?.trim();

        if (!normalizedMessage || this.loading || this.initializing || !!this.deletingConversationId) {
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

        const handleResponse = (response: ChatbotMessageResponse): void => {
            this.conversationId = response.conversationId;
            this.selectedConversationId = response.conversationId;
            this.hasMoreHistoryMessages = false;
            this.currentHistoryPage = 0;

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
            this.focusComposer();
        };

        const handleError = (errorMessage: string): void => {
            this.error = errorMessage;
            this.loading = false;
            this.scrollToBottom();
            this.focusComposer();
        };

        if (this.conversationId) {
            this.chatbotService.sendMessage({
                conversationId: this.conversationId,
                message: normalizedMessage
            }).subscribe({
                next: handleResponse,
                error: () => handleError('No se pudo obtener respuesta del asistente.')
            });
        } else if (this.requiresConversation()) {
            this.chatbotService.startContextualConversation({
                engagementLetterId: this.dialogData!.engagementLetterId
            }).subscribe({
                next: response => {
                    this.conversationId = response.conversationId;
                    this.selectedConversationId = response.conversationId;
                    this.error = response.error ?? '';

                    this.chatbotService.sendMessage({
                        conversationId: response.conversationId,
                        message: normalizedMessage
                    }).subscribe({
                        next: handleResponse,
                        error: () => handleError('No se pudo obtener respuesta del asistente.')
                    });
                },
                error: () => handleError('No se pudo iniciar la conversación contextual.')
            });
        } else {
            this.chatbotService.startGeneralConversation({
                message: normalizedMessage
            }).subscribe({
                next: handleResponse,
                error: () => handleError('No se pudo obtener respuesta del asistente.')
            });
        }

        this.message = '';
        this.focusComposer();
    }

    closeDialog(): void {
        this.closeFromModalInteraction();
    }

    toggleSidebar(): void {
        this.sideBarOpened = !this.sideBarOpened;
    }

    closeSidebar(): void {
        this.sideBarOpened = false;
    }

    startNewConversation(): void {
        if (this.isBusy()) {
            return;
        }

        this.error = '';
        this.message = '';

        if (!this.conversationId) {
            this.resetConversationState(this.requiresConversation());
            return;
        }

        this.closeCurrentConversationForReset();
    }

    private resetConversationState(scroll: boolean): void {
        this.messages = [];
        this.conversationId = undefined;
        this.selectedConversationId = undefined;
        this.conversationStatus = 'ACTIVE';
        this.closeSidebar();

        if (scroll) {
            this.scrollToBottom();
        }
    }

    private closeCurrentConversationForReset(): void {
        const conversationId = this.conversationId;
        if (!conversationId) {
            return;
        }

        this.closingConversation = true;

        this.chatbotService.closeConversation(conversationId).subscribe({
            next: () => {
                this.closingConversation = false;
                this.resetConversationState(true);
                this.loadHistoryList();
            },
            error: () => {
                this.error = 'No se pudo cerrar la conversación actual antes de crear una nueva.';
                this.closingConversation = false;
            }
        });
    }

    selectConversation(item: ChatbotConversationSummary): void {
        if (this.isBusy()) {
            return;
        }

        const previousConversationId = this.conversationId;
        const hasPreviousActiveConversation = !!previousConversationId
            && previousConversationId !== item.conversationId
            && this.historyItems.some(historyItem =>
                historyItem.conversationId === previousConversationId && historyItem.status === 'ACTIVE'
            );

        const openSelectedConversation = (): void => {
            this.initializing = true;
            this.error = '';
            this.conversationId = item.conversationId;
            this.selectedConversationId = item.conversationId;
            this.currentHistoryPage = 0;
            this.hasMoreHistoryMessages = false;
            this.allowHistoryIncrementalLoad = false;

            const loadHistory = (): void => {
                this.chatbotService.readConversationHistory(
                    item.conversationId,
                    0,
                    ChatbotComponent.HISTORY_PAGE_SIZE
                ).subscribe({
                    next: history => {
                        this.messages = this.mapHistoryMessages(history);
                        this.conversationStatus = history.status;
                        this.currentHistoryPage = history.page ?? 0;
                        this.hasMoreHistoryMessages = history.hasMore ?? false;
                        this.initializing = false;
                        this.closeSidebar();
                        this.scrollToBottom();
                        setTimeout(() => {
                            this.allowHistoryIncrementalLoad = true;
                        }, 250);
                        this.loadHistoryList();
                        this.focusComposer();
                    },
                    error: () => {
                        this.error = 'No se pudo recuperar la conversación seleccionada.';
                        this.initializing = false;
                    }
                });
            };

            if (item.status === 'ACTIVE') {
                loadHistory();
                return;
            }

            this.chatbotService.reopenConversation(item.conversationId).subscribe({
                next: () => {
                    this.conversationStatus = 'ACTIVE';
                    loadHistory();
                },
                error: () => {
                    this.error = 'No se pudo reabrir la conversación seleccionada.';
                    this.initializing = false;
                }
            });
        };

        if (!hasPreviousActiveConversation) {
            openSelectedConversation();
            return;
        }

        if (!previousConversationId) {
            openSelectedConversation();
            return;
        }

        this.chatbotService.closeConversation(previousConversationId).subscribe({
            next: () => {
                this.markConversationAsClosed(previousConversationId);
                openSelectedConversation();
            },
            error: () => {
                openSelectedConversation();
            }
        });
    }

    onMessagesScroll(): void {
        const container = this.messagesContainer?.nativeElement;

        if (container) {
            const isAwayFromBottom = (container.scrollTop + container.clientHeight) < (container.scrollHeight - 40);
            if (isAwayFromBottom) {
                this.cancelPendingAutoScroll();
            }
        }

        if (!this.allowHistoryIncrementalLoad) {
            return;
        }

        if (!container || this.initializing || this.loading || this.loadingOlderMessages) {
            return;
        }

        if (!this.conversationId || !this.hasMoreHistoryMessages) {
            return;
        }

        if (container.scrollTop > 20) {
            return;
        }

        this.loadOlderMessages();
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

    isDeletingConversation(item: ChatbotConversationSummary): boolean {
        return this.deletingConversationId === item.conversationId;
    }

    confirmDeleteConversation(item: ChatbotConversationSummary, event?: Event): void {
        event?.stopPropagation();

        if (this.isBusy()) {
            return;
        }

        this.dialog.open(CancelYesDialogComponent, {
            data: {
                title: 'Confirmar eliminacion',
                message: 'Esta conversacion se eliminara del historial. ¿Desea continuar?'
            }
        }).afterClosed().subscribe(confirmed => {
            if (confirmed === true) {
                this.deleteConversation(item);
            }
        });
    }

    private deleteConversation(item: ChatbotConversationSummary): void {
        if (this.isBusy() || this.isDeletingConversation(item)) {
            return;
        }

        this.error = '';
        this.deletingConversationId = item.conversationId;

        this.chatbotService.deleteConversation(item.conversationId).subscribe({
            next: () => {
                this.historyItems = this.historyItems.filter(historyItem =>
                    historyItem.conversationId !== item.conversationId
                );

                if (this.conversationId === item.conversationId || this.selectedConversationId === item.conversationId) {
                    this.resetConversationState(true);
                }

                this.deletingConversationId = undefined;
            },
            error: () => {
                this.error = 'No se pudo borrar la conversacion seleccionada.';
                this.deletingConversationId = undefined;
            }
        });
    }

    private loadHistoryList(): void {
        this.historyLoading = true;
        this.historyError = '';

        this.chatbotService.readConversations(
            this.requiresConversation() ? 'CONTEXTUAL' : 'GENERAL',
            this.dialogData?.engagementLetterId
        ).subscribe({
            next: items => {
                this.historyItems = items;
                this.historyLoading = false;
            },
            error: () => {
                this.historyError = 'No se pudo cargar el historial de conversaciones.';
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

    private closeFromModalInteraction(): void {
        if (!this.dialogRef) {
            return;
        }

        if (this.modalCloseRequested) {
            return;
        }

        this.modalCloseRequested = true;

        if (this.closingConversation) {
            this.dialogRef.close();
            return;
        }

        this.closingConversation = true;
        this.closeConversationIdsSilently(this.getDialogConversationIdsToClose(), () => {
            this.closingConversation = false;
            this.dialogRef?.close();
        });
    }

    private closeAllActiveConversationsSilently(): void {
        const activeIds = this.isDialogMode()
            ? this.getDialogConversationIdsToClose()
            : this.getActiveConversationIds();

        if (!activeIds.length) {
            return;
        }

        this.closeConversationIdsSilently(activeIds);
    }

    private getDialogConversationIdsToClose(): string[] {
        if (!this.conversationId || this.conversationStatus !== 'ACTIVE') {
            return [];
        }
        return [this.conversationId];
    }

    private getActiveConversationIds(): string[] {
        const ids = new Set(
            this.historyItems
                .filter(item => item.status === 'ACTIVE')
                .map(item => item.conversationId)
        );

        if (this.conversationId) {
            ids.add(this.conversationId);
        }

        return Array.from(ids);
    }

    private closeConversationIdsSilently(ids: string[], onComplete?: () => void): void {
        if (!ids.length) {
            onComplete?.();
            return;
        }

        forkJoin(
            ids.map(id => this.chatbotService.closeConversation(id).pipe(
                catchError(() => of(void 0))
            ))
        ).subscribe({
            next: () => {
                ids.forEach(id => this.markConversationAsClosed(id));
                onComplete?.();
            },
            error: () => {
                onComplete?.();
            }
        });
    }

    private markConversationAsClosed(conversationId: string): void {
        this.historyItems = this.historyItems.map(item =>
            item.conversationId === conversationId
                ? {...item, status: 'CLOSED'}
                : item
        );
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
        if (this.loading || this.initializing || !!this.deletingConversationId) {
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
        this.cancelPendingAutoScroll();

        const scroll = (): void => {
            const container = this.messagesContainer?.nativeElement;

            if (!container) {
                return;
            }

            container.scrollTop = container.scrollHeight;
        };

        this.autoScrollTimeouts.push(window.setTimeout(scroll, 0));
        this.autoScrollTimeouts.push(window.setTimeout(scroll, 80));
        this.autoScrollTimeouts.push(window.setTimeout(scroll, 180));
    }

    private cancelPendingAutoScroll(): void {
        this.autoScrollTimeouts.forEach(timeoutId => window.clearTimeout(timeoutId));
        this.autoScrollTimeouts = [];
    }

    private loadOlderMessages(): void {
        if (!this.conversationId || this.loadingOlderMessages || !this.hasMoreHistoryMessages) {
            return;
        }

        const container = this.messagesContainer?.nativeElement;
        const previousHeight = container?.scrollHeight ?? 0;
        const nextPage = this.currentHistoryPage + 1;

        this.loadingOlderMessages = true;

        this.chatbotService.readConversationHistory(
            this.conversationId,
            nextPage,
            ChatbotComponent.HISTORY_PAGE_SIZE
        ).subscribe({
            next: history => {
                const olderMessages = this.mapHistoryMessages(history);
                this.messages = [...olderMessages, ...this.messages];
                this.currentHistoryPage = history.page ?? nextPage;
                this.hasMoreHistoryMessages = history.hasMore ?? false;
                this.loadingOlderMessages = false;

                setTimeout(() => {
                    const currentContainer = this.messagesContainer?.nativeElement;

                    if (!currentContainer) {
                        return;
                    }

                    const newHeight = currentContainer.scrollHeight;
                    currentContainer.scrollTop = newHeight - previousHeight + currentContainer.scrollTop;
                });
            },
            error: () => {
                this.error = 'No se pudieron cargar mensajes anteriores.';
                this.loadingOlderMessages = false;
            }
        });
    }

    private focusComposer(): void {
        setTimeout(() => {
            this.composerTextarea?.nativeElement?.focus();
        });
    }

    private isBusy(): boolean {
        return this.loading || this.initializing || this.closingConversation || !!this.deletingConversationId;
    }

    private loadConfigurationStatus(): void {
        this.chatbotService.readConfigurationStatus().subscribe({
            next: status => this.configurationStatus = status,
            error: () => this.configurationStatus = undefined
        });
    }

    aiModelLabel(): string {
        if (!this.configurationStatus?.model) {
            return 'IA configurada por el sistema';
        }

        const provider = this.configurationStatus.provider || 'IA';
        return `IA: ${provider} · ${this.configurationStatus.model}`;
    }

}
