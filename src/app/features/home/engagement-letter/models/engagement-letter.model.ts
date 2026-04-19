import {User} from "../../../shared/models/user.model";
import {LegalProcedure} from "./legal-procedure.model";
import {PaymentMethod} from "./payment-method.model";
import {AcceptanceDocument} from "./acceptance-document.model";

// engagement-letter.model.ts
export interface EngagementLetter {
    id?: string;
    budgetOnly?: boolean;
    discount?: number;
    creationDate?: Date | string;
    closingDate?: Date | string;
    owner?: User;
    attachments?: User[];
    legalProcedures?: LegalProcedure[];
    paymentMethods?: PaymentMethod[];
    legalClause?: string;
    acceptanceDocuments?: AcceptanceDocument[];
}