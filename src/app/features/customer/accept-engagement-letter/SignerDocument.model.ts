export interface SignerDocument {
    documentAccepted?: boolean;
    signature?: string; // Firma en formato dataURL (base64 PNG)
}