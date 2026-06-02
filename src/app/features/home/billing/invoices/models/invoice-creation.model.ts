export interface InvoiceCreation {
    userId: string;
    concept: string;
    baseAmount: number;
    baseExpense?: number;
    vatExpense?: number;
    discounts: number[];
}
