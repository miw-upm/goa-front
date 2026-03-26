import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ChatbotMessageView} from "../models/chatbot.model";
import {ChatbotService} from "../chatbot.service";

@Component({
    standalone: true,
    selector: "app-chatbot",
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule
    ],
    templateUrl: "./chatbot.component.html",
    styleUrls: ["./chatbot.component.css"]
})

export class ChatbotComponent {
    message = '';
    conversationId?: string;
    loading = false;
    error = '';
    messages: ChatbotMessageView[] = [];

    constructor(private readonly chatbotService: ChatbotService) {
    }

    send(): void {
        const normalizedMessage = this.message?.trim();

        if (!normalizedMessage || this.loading) {
            return;
        }

        this.error = '';
        this.messages.push({
            sender: 'USER',
            content: normalizedMessage,
            createdAt: new Date().toISOString()
        });

        this.loading = true;

        this.chatbotService.sendMessage({
            conversationId: this.conversationId,
            message: normalizedMessage
        }).subscribe({
            next: response => {
                this.conversationId = response.conversationId;

                if (response.message) {
                    this.messages.push({
                        sender: 'ASSISTANT',
                        content: response.message,
                        createdAt: response.createdAt
                    });
                }

                if (response.error) {
                    this.error = response.error;
                }

                this.loading = false;
            },
            error: () => {
                this.error = 'No se pudo obtener respuesta del asistente.';
                this.loading = false;
            }
        });

        this.message = '';
    }
}
