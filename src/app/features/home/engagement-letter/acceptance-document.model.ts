import {User} from "@shared/models/user.model";

export interface AcceptanceDocument {
    signatureDate: Date;
    receipt: string;
    signer: User;
}