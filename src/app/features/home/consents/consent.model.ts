export interface Consent {
    id?: string;
    signatureAt?: string;
    signerFullName?: string;
    signerIdentity?: string;
    mobile?: string;
    signerEmail?: string;
    signatureToken?: string;
    deviceInfo?: any;
    policyVersion?: string;
    dataProcessingAccepted?: boolean;
    promotionsAccepted?: boolean;
}
