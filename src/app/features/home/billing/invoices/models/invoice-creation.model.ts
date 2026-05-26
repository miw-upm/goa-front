export interface InvoiceCreation {
    userId: string;
    concept: string;
    baseAmount: number;
    discounts: number[];
}
