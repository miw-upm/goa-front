export interface InvoiceCreationFromEngagement {
    engagementId: string;
    totalBaseAmount: number;
    concept: string;
    discounts: number[];
}
