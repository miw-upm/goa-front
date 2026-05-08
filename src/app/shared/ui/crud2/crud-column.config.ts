export type CrudColumnFormat = 'text' | 'date' | 'boolean' | 'currency' | 'number';

export interface CrudBooleanConfig {
    trueLabel: string;
    falseLabel: string;
    trueColor?: string;
    falseColor?: string;
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

    /** Separador cuando se concatenan múltiples fields en la misma línea (default: ' ') */
    separator?: string;

    /** Clase CSS adicional para la columna */
    cssClass?: string;
}
