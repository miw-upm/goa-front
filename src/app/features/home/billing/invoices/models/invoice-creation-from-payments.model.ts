import {InvoiceBillingPercentage} from './invoice-creation-from-engagement.model';

export interface InvoiceCreationFromPayments {
    engagementId: string;
    billingPercentages: InvoiceBillingPercentage[];
}
