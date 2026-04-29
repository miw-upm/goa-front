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

export interface ChatbotHistoryMessage {
    id: string;
    conversationId: string;
    senderType: 'USER' | 'ASSISTANT' | 'SYSTEM';
    messageType: 'REQUEST' | 'RESPONSE' | 'INSTRUCTION';
    content: string;
    timestamp?: string;
    sequenceNumber: number;
    parentMessageId?: string;
}

export interface ChatbotConversationHistoryResponse {
    conversationId: string;
    engagementLetterId?: string;
    type: 'GENERAL' | 'CONTEXTUAL';
    status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
    page?: number;
    size?: number;
    hasMore?: boolean;
    totalMessages?: number;
    messages: ChatbotHistoryMessage[];
}

export interface ChatbotConversationSummary {
    conversationId: string;
    type: 'GENERAL' | 'CONTEXTUAL';
    status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
    engagementLetterId?: string;
    createdAt: string;
    lastMessageAt?: string;
    preview?: string;
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