import {EngagementLetter} from '../../../engagement-letter/models/engagement-letter.model';
import {SupplierInfo} from './supplier-info.model';
import {ExpenseType} from "./expense-type.model";

export interface Expense {
    id?: string;
    recordedAt?: string;
    engagement?: EngagementLetter;
    issueDate: string;
    baseAmount: number;
    vatRate: number;
    supplier: SupplierInfo;
    taxCategory: string;
    expenseType: ExpenseType;
    description?: string;
    withholdingTax?: number;
    documentPath?: string;
}
