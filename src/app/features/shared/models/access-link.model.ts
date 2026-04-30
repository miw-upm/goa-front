export interface AccessLink {
    id?: string;
    mobile?: string;
    urlId?: string;
    token?: string;
    fullName?: string;
    lastUsedAt?: Date;
    expiresAt?: Date;
    scope: string;
    documentId: string;
}