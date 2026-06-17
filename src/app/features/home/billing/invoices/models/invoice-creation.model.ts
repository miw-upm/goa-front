export interface InvoiceCreation {
    userId: string;
    concept: string;
    baseAmount: number;
    withholdingRate?: number;
    baseExpense?: number;
    vatExpense?: number;
    operationDate?: string;
}
