export interface BackendError {
    error: string;    // nombre de la clase de excepción (p.ej. "ConflictException")
    message: string;  // mensaje corto que explica la razón
    cause: string;    // detalle ampliado (puede venir vacío)
}

export function isBackendError(value: unknown): value is BackendError {
    return typeof value === 'object'
        && value !== null
        && typeof (value as BackendError).error === 'string'
        && typeof (value as BackendError).message === 'string'
        && typeof (value as BackendError).cause === 'string';
}
