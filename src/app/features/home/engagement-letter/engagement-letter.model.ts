import {User} from "@shared/models/user.model";
import {LegalProcedure} from "./legal-procedure.model";
import {PaymentMethod} from "./payment-method.model";
import {AcceptanceDocument} from "./acceptance-document.model";

export interface EngagementLetter {
    id?: string;
    discount?: number;
    creationDate?: Date;
    closingDate?: Date;
    owner?: User;
    attachments?: User[];
    legalProcedures?: LegalProcedure[];
    paymentMethods?: PaymentMethod[];
    acceptanceDocuments?: AcceptanceDocument[];
}