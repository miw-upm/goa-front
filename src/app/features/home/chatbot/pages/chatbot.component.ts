import {Component, ElementRef, Inject, OnDestroy, OnInit, Optional, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RouterLink} from "@angular/router";
import {AuthService} from "@core/auth/auth.service";
import {CHATBOT_SCOPE_RESTRICTED_REPLIES, CHATBOT_SCOPE_UI} from "../support/chatbot-scope-ui";

import {
    ChatbotMessageView,
    ContextualChatbotDialogData
} from "../models/chatbot.model";
import {ChatbotService} from "../chatbot.service";
import {TextFieldModule} from "@angular/cdk/text-field";

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
        TextFieldModule,
        RouterLink
    ],
    templateUrl: "./chatbot.component.html",
    styleUrls: ["./chatbot.component.css"]
})

export class ChatbotComponent implements OnInit, OnDestroy {
    @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

    message = '';
    conversationId?: string;
    loading = false;
    initializing = false;
    error = '';
    messages: ChatbotMessageView[] = [];
    private conversationClosed = false;

    constructor(
        private readonly chatbotService: ChatbotService,
        private readonly authService: AuthService,
        @Optional() @Inject(MAT_DIALOG_DATA) public readonly dialogData: ContextualChatbotDialogData | null,
        @Optional() private readonly dialogRef: MatDialogRef<ChatbotComponent> | null
    ) {
    }

    ngOnInit(): void {
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
                this.error = response.error ?? '';
                this.initializing = false;
            },
            error: () => {
                this.error = 'No se pudo iniciar la conversación contextual.';
                this.initializing = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.closeConversationOnExit();
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

                if (response.message) {
                    this.messages.push({
                        sender: 'ASSISTANT',
                        content: response.message,
                        createdAt: response.createdAt,
                        restricted: this.isRestrictedAssistantReply(response.message)
                    });
                    this.scrollToBottom();
                }

                if (response.error) {
                    this.error = response.error;
                }

                this.loading = false;
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

    handleMessageKeydown(event: KeyboardEvent): void {
        if (event.key !== 'Enter' || event.shiftKey || event.isComposing) {
            return;
        }

        event.preventDefault();
        this.send();
    }

    close(): void {
        this.dialogRef?.close();
    }

    isDialogMode(): boolean {
        return !!this.dialogRef;
    }

    requiresConversation(): boolean {
        return !!this.dialogData?.engagementLetterId;
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

    private closeConversationOnExit(): void {
        if (!this.conversationId || this.conversationClosed) {
            return;
        }

        this.conversationClosed = true;

        this.chatbotService.closeConversation(this.conversationId).subscribe({
            error: () => undefined
        });
    }
}
