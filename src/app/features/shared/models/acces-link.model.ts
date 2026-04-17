export interface AccessLink {
    id?: string;
    mobile: string;
    scope: string;
    lastUsedForUpdateAt?: Date;
    document?: string;
}