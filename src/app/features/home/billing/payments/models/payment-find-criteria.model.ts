export interface PaymentFindCriteria {
    invoiced?: boolean;
    engagementReference?: string;
    client?: string;
    fromDate?: string;
}
