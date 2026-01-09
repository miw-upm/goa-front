import {User} from "../../../common/models/user.model";

export interface AcceptanceDocument {
    signatureDate: Date;
    receipt: string;
    signer: User;
}