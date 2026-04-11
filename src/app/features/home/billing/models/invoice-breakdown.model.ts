export interface BreakdownItem {
    id: string;
    amountWithVat: number;
    taxableBase: number;
    vatAmount: number;
}

export interface InvoiceBreakdown {
    taxableBase: number;
    vatAmount: number;
    totalAmount: number;
    incomes: BreakdownItem[];
    expenses: BreakdownItem[];
}

