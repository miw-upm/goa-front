import {LegalProcedure} from '../../../home/engagement-letter/models/legal-procedure.model';
import {PaymentMethod} from '../../../home/engagement-letter/models/payment-method.model';

export interface PublicEngagementLetter {
    id: string;
    creationDate: string;
    discount: number;
    closingDate: string;
    legalProcedures: LegalProcedure[];
    paymentMethods: PaymentMethod[];
}
