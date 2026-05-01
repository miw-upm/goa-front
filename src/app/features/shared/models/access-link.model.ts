export interface AccessLink {
    id?: string;
    urlId?: string;
    token?: string;
    fullName?: string;
    createdAt?: Date;
    lastUsedAt?: Date;
    expiresAt?: Date;
    remainingUses?: number
    scope: string;
    documentId: string;
}