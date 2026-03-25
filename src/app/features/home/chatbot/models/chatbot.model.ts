export interface ChatbotMessageRequest {
    conversationId?: string;
    message: string | undefined ;
}

export interface ChatbotMessageResponse {
    conversationId?: string;
    message?: string;
    error?: string;
    createdAt?: string;
}

export interface ChatbotMessageView{
    sender: 'USER' | 'ASSISTANT';
    content: string;
    createdAt?: string;
}
