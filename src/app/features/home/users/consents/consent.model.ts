export interface Consent {
    id?: string;
    signatureAt?: string;
    signerFullName?: string;
    mobile?: string;
    deviceInfo?: any;
    policyVersion?: string;
    dataProcessingAccepted?: boolean;
    promotionsAccepted?: boolean;
}
