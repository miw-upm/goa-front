import {PaymentMethod} from './payment-method.model';
import {LegalProcedure} from '../../../engagement-letter/models/legal-procedure.model';

export interface EngagementSnapshot {
    id?: string;
    legalProcedures?: LegalProcedure[];
}

export interface UserSnapshot {
    id?: string;
    mobile?: string;
    firstName?: string;
    familyName?: string;
}

export interface Payment {
    id?: string;
    date: string;
    engagement?: EngagementSnapshot;
    user: UserSnapshot;
    amount: number;
    method: PaymentMethod;
    invoiced?: boolean;
}
