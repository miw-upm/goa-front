import {CommonModule} from "@angular/common";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

import {ChatbotService} from "../chatbot.service";
import {ChatbotConversationSummary, ChatbotMessageView} from "../models/chatbot.model";

@Component({
    standalone: true,
    selector: "app-chatbot-history",
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: "./chatbot-history.component.html",
    styleUrls: ["./chatbot-history.component.css"]
})
export class ChatbotHistoryComponent implements OnInit {
    @ViewChild("messagesContainer") private messagesContainer?: ElementRef<HTMLDivElement>;

    conversations: ChatbotConversationSummary[] = [];
    selectedConversation?: ChatbotConversationSummary;
    messages: ChatbotMessageView[] = [];

    loadingConversations = false;
    loadingMessages = false;
    conversationsError = "";
    messagesError = "";

    constructor(private readonly chatbotService: ChatbotService) {
    }

    ngOnInit(): void {
        this.loadConversations();
    }

    selectConversation(conversation: ChatbotConversationSummary): void {
        if (this.selectedConversation?.conversationId === conversation.conversationId && this.messages.length > 0) {
            return;
        }

        const requestedConversationId = conversation.conversationId;

        this.selectedConversation = conversation;
        this.messages = [];
        this.messagesError = "";
        this.loadingMessages = true;

        this.chatbotService.readMessagesOneConversation(requestedConversationId).subscribe({
            next: messages => {
                if (this.selectedConversation?.conversationId !== requestedConversationId) {
                    return;
                }

                this.messages = messages;
                this.loadingMessages = false;
                this.scrollToBottom();
            },
            error: () => {
                if (this.selectedConversation?.conversationId !== requestedConversationId) {
                    return;
                }

                this.messagesError = "No se pudieron cargar los mensajes de la conversación.";
                this.loadingMessages = false;
            }
        });
    }

    conversationTitle(conversation: ChatbotConversationSummary, index: number): string {
        return conversation.title?.trim()
            || `Conversación ${index + 1}`;
    }

    conversationPreview(conversation: ChatbotConversationSummary): string {
        return conversation.preview?.trim()
            || "Sin vista previa disponible.";
    }

    conversationTimestamp(conversation: ChatbotConversationSummary): string | undefined {
        return conversation.updatedAt || conversation.createdAt;
    }

    selectedConversationTitle(): string {
        if (!this.selectedConversation) {
            return "Selecciona una conversación";
        }

        const index = this.conversations.findIndex(item => item.conversationId === this.selectedConversation?.conversationId);
        return this.conversationTitle(this.selectedConversation, index >= 0 ? index : 0);
    }

    senderLabel(message: ChatbotMessageView): string {
        return message.sender === "USER" ? "Tú" : "Asistente";
    }

    trackConversation(_: number, conversation: ChatbotConversationSummary): string {
        return conversation.conversationId;
    }

    trackMessage(index: number, message: ChatbotMessageView): string {
        return `${message.sender}-${message.createdAt ?? index}`;
    }

    private loadConversations(): void {
        this.loadingConversations = true;
        this.conversationsError = "";

        this.chatbotService.readAllConversations().subscribe({
            next: conversations => {
                this.conversations = conversations;
                this.loadingConversations = false;

                if (conversations.length > 0) {
                    this.selectConversation(conversations[0]);
                }
            },
            error: () => {
                this.conversationsError = "No se pudo cargar el histórico de conversaciones.";
                this.loadingConversations = false;
            }
        });
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
