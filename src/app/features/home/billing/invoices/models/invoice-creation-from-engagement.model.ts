import {LegalProcedure} from '../../../engagement-letter/models/legal-procedure.model';

export interface InvoiceBillingPercentage {
    userId: string;
    percentage: number;
}

export interface InvoiceCreationFromEngagement {
    engagementId: string;
    closeEngagement: boolean;
    legalProcedures: LegalProcedure[];
    billingPercentages: InvoiceBillingPercentage[];
}
