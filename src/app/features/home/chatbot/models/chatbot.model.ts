export interface ChatMessageRequest {
    conversationId?: string;
    message: string | undefined ;
}

export interface ChatMessageResponse {
    conversationId?: string;
    message?: string;
    error?: string;
    createdAt?: string;
}

export interface ChatMessageView{
    sender: 'USER' | 'ASSISTANT';
    content: string;
    createdAt?: string;
}
