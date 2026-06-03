import {EngagementLetter} from '../../../engagement-letter/models/engagement-letter.model';
import {LegalProcedure} from '../../../engagement-letter/models/legal-procedure.model';
import {Payment} from '../../payments/models/payment.model';
import {BillingInfo} from './billing-info.model';

export interface OriginalInvoice {
    series?: string;
    number?: number;
    emissionDate?: string;
    reason?: string;
}

export interface Invoice {
    id?: string;
    billingInfo: BillingInfo;
    concept?: string;
    emissionDate?: string;
    operationDate?: string;
    series?: string;
    number?: number;
    baseAmount: number;
    vatRate?: number;
    baseExpense?: number | string;
    vatExpense?: number | string;
    percentage?: number | string;
    engagement?: EngagementLetter;
    legalProcedures?: LegalProcedure[];
    payments?: Payment[];
    discounts?: number[];
    pdfPath?: string;
    originalInvoice?: OriginalInvoice;
    rectification?: boolean;
    issued?: boolean;
}
