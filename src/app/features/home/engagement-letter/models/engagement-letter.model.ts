import {User} from "../../../shared/models/user.model";
import {LegalProcedure} from "./legal-procedure.model";
import {PaymentMethod} from "./payment-method.model";
import {AcceptanceEngagement} from "./acceptance-engagement.model";

export interface EngagementLetter {
    id?: string;
    budgetOnly?: boolean;
    discount?: number;
    lastUpdatedDate?: Date | string;
    closingDate?: Date | string;
    owner?: User;
    attachments?: User[];
    legalProcedures?: LegalProcedure[];
    paymentMethods?: PaymentMethod[];
    legalClause?: string;
    acceptanceEngagements?: AcceptanceEngagement[];
}