import {EngagementLetter} from '../../../engagement-letter/models/engagement-letter.model';
import {SupplierInfo} from './supplier-info.model';

export interface Expense {
    id?: string;
    recordedAt?: string;
    engagement?: EngagementLetter;
    issueDate: string;
    baseAmount: number;
    vatRate: number;
    supplier: SupplierInfo;
    taxCategory: string;
    description?: string;
    withholdingTax?: number;
    documentPath?: string;
}
