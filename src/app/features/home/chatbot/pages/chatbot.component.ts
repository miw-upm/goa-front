import {Component, ElementRef, Inject, Optional, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
        TextFieldModule
    ],
    templateUrl: "./chatbot.component.html",
    styleUrls: ["./chatbot.component.css"]
})

export class ChatbotComponent {
    @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

    message = '';
    conversationId?: string;
    loading = false;
    initializing = false;
    error = '';
    messages: ChatbotMessageView[] = [];

    constructor(
        private readonly chatbotService: ChatbotService,
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
                        createdAt: response.createdAt
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
}
