export enum ComplaintState {
    OPENED = 'OPENED',
    CLOSED = 'CLOSED'
}

export interface Complaint {
    id?: string;               // Hash (Expediente + Usuario + Estado)
    registrationDate?: Date;
    mobile: string;            // En tu lógica, este es el ID del Cliente
    barcode: string;           // ID del Expediente / Hoja de Encargo
    description: string;
    state?: ComplaintState;
    reply?: string;            // Respuesta del despacho
}