import {OriginalInvoice} from './invoice.model';

export interface InvoiceCreationManualRectification {
    originalInvoice: OriginalInvoice;
    concept: string;
    userId: string;
    percentage?: number;
    operationDate?: string;
    baseAmount: number;
    vatAmount: number;
    vatRate: number;
    baseExpense?: number;
    vatExpense?: number;
}
