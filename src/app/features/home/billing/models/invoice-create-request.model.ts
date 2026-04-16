export interface InvoiceCreateRequest {
    engagementId?: string;
    date?: string;
    expenseIds: string[];
    incomeIds: string[];
}
