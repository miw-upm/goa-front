import {EngagementLetter} from '../../engagement-letter/models/engagement-letter.model';
import {Payment} from '../../payments/models/payment.model';
import {BillingInfo} from './billing-info.model';

export interface Rectification {
    reason?: string;
}

export interface Invoice {
    id?: string;
    billingInfo: BillingInfo;
    emissionDate?: string;
    operationDate?: string;
    series?: string;
    number?: number;
    baseAmount: number;
    vatRate?: number;
    engagement?: EngagementLetter;
    payments?: Payment[];
    discounts?: number[];
    pdfPath?: string;
    rectification?: Rectification;
}
