export type CrudColumnFormat = 'text' | 'date' | 'boolean' | 'currency' | 'number';

export interface CrudBooleanConfig {
    trueLabel?: string;   // default: 'SI'
    falseLabel?: string;  // default: 'NO'
    trueColor?: string;   // default: 'success'  → bool-chip--success
    falseColor?: string;  // default: 'primary'  → bool-chip--primary
    showIcon?: boolean;   // default: true
}

export interface CrudColumnConfig {
    /** Clave interna (o nombre virtual para columnas compuestas) */
    key: string;

    /** Label visible en la cabecera de la tabla */
    label: string;

    /** Campos principales resaltados (font-weight 500). Se concatenan separados por separator.
     *  Si no se define, no hay línea resaltada. */
    fieldsTitle?: string[];

    /** Campos secundarios (texto normal, gris si hay fieldsTitle). Se concatenan separados por separator. */
    fields?: string[];

    /** Formato de visualización (default: 'text') */
    format?: CrudColumnFormat;

    /** Para format='boolean': textos y colores personalizados */
    booleanConfig?: CrudBooleanConfig;

    /** Para format='date': patrón DatePipe (default: 'd MMM yyyy') */
    dateFormat?: string;

    /** Para arrays de objetos: campo a extraer de cada elemento (ej: 'title').
     *  Muestra el primer valor en negrita, el segundo como secundario, y (+N más) si hay más. */
    arrayField?: string;

    /** Separador cuando se concatenan múltiples fields en la misma línea (default: ' ') */
    separator?: string;

    /** Clase CSS adicional para la columna */
    cssClass?: string;
}
