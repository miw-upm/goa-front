import {Quarter} from './quarter.model';

export interface Model303 {
    year: number;
    quarter: Quarter;
    vatSummary: VatSummary;
}

export interface VatSummary {
    invoiceIssuedBase: number;
    invoiceIssuedVat: number;
    invoiceReceivedCurrentBase: number;
    invoiceReceivedCurrentVat: number;
    invoiceReceivedInvestmentBase: number;
    invoiceReceivedInvestmentVat: number;
}

