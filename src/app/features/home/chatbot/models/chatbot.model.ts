export interface ChatbotContextualConversationRequest {
    engagementLetterId: string;
}

export interface ChatbotContextualConversationResponse {
    conversationId: string;
    engagementLetterId: string;
    createdAt?: string;
    error?: string;
}

export interface ChatbotMessageRequest {
    conversationId?: string;
    message: string | undefined;
}

export interface ChatbotMessageResponse {
    conversationId?: string;
    message?: string;
    error?: string;
    createdAt?: string;
    responseMode?: 'GENERAL' | 'CONTEXTUAL_PLATFORM_DATA' | 'CONTEXTUAL_RESTRICTED';
    usedPlatformData?: boolean;
    sourcesSummary?: string[];
}

export interface ChatbotConversationSummary {
    conversationId: string;
    title?: string;
    preview?: string;
    engagementLetterId?: string;
    createdAt?: string;
    updatedAt?: string;
    closedAt?: string;
}

export interface ChatbotConversationMessageResponse {
    conversationId?: string;
    senderType?: string;
    messageType?: string;
    content?: string;
    createdAt?: string;
    restricted?: boolean;
}

export interface ChatbotMessageView {
    sender: 'USER' | 'ASSISTANT';
    content: string;
    createdAt?: string;
    restricted?: boolean;
    usedPlatformData?: boolean;
    sourcesSummary?: string[];
    responseMode?: 'GENERAL' | 'CONTEXTUAL_PLATFORM_DATA' | 'CONTEXTUAL_RESTRICTED';
}

export interface ContextualChatbotDialogData {
    engagementLetterId: string;
}

export interface ChatbotToastView {
    id: number;
    kind: 'info' | 'success' | 'warning';
    title: string;
    message: string;
}