export type ChatbotConversationType = 'GENERAL' | 'CONTEXTUAL';
export type ChatbotConversationStatus = 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
export type ChatbotResponseMode = 'GENERAL' | 'CONTEXTUAL_PLATFORM_DATA' | 'CONTEXTUAL_RESTRICTED';
export type ChatbotSenderType = 'USER' | 'ASSISTANT';

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
    message: string;
}

export interface ChatbotMessageResponse {
    conversationId?: string;
    message?: string;
    error?: string;
    createdAt?: string;
    responseMode?: ChatbotResponseMode;
    usedPlatformData?: boolean;
    sourcesSummary?: string[];
}

export interface ChatbotHistoryMessage {
    id: string;
    conversationId: string;
    senderType: ChatbotSenderType | 'SYSTEM';
    messageType: 'REQUEST' | 'RESPONSE' | 'INSTRUCTION';
    content: string;
    timestamp?: string;
    sequenceNumber: number;
    parentMessageId?: string;
}

export interface ChatbotConversationHistoryResponse {
    conversationId: string;
    engagementLetterId?: string;
    type: ChatbotConversationType;
    status: ChatbotConversationStatus;
    page?: number;
    size?: number;
    hasMore?: boolean;
    totalMessages?: number;
    messages: ChatbotHistoryMessage[];
}

export interface ChatbotConversationSummary {
    conversationId: string;
    type: ChatbotConversationType;
    status: ChatbotConversationStatus;
    engagementLetterId?: string;
    createdAt: string;
    lastMessageAt?: string;
    preview?: string;
}

export interface ChatbotMessageView {
    sender: ChatbotSenderType;
    content: string;
    createdAt?: string;
    restricted?: boolean;
    usedPlatformData?: boolean;
    sourcesSummary?: string[];
    responseMode?: ChatbotResponseMode;
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
