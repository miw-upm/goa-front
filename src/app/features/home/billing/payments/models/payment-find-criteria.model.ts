export interface PaymentFindCriteria {
    invoiced?: boolean;
    engagementId?: string;
    client?: string;
    fromDate?: Date | string;
}
