export interface PublicAccessToken {
    token: string;
    purpose: string;
    expiresAt: string;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
    publicUrl: string;
}
