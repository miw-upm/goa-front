import {CrudColumnConfig} from "@shared/ui/crud/crud-column.config";

export const EXPENSES_COLUMNS: CrudColumnConfig[] = [
    {
        key: 'capital',
        label: 'TIPO GASTO',
        format: 'select',
        selectConfig: {
            true: {label: 'Inversión', color: 'primary'},
            false: {label: 'Corriente', color: 'default'}
        }
    },
    {key: 'issueDate', label: 'FECHA EMISION ', format: 'date', dateFormat: 'dd/MM/yyyy'},
    {key: 'number', label: 'NUMERO / SERIE', fieldsTitle: ['number'], fields: ['series']},
    {key: 'supplier', label: 'PROVEEDOR', fieldsTitle: ['supplier.name'], fields: ['supplier.identity']},
    {
        key: 'amounts', label: ' (IVA) BASE / TOTAL',
        fieldsRef: ['vatRate'],
        fieldsTitle: ['baseAmount'],
        fields: ['total'],
        format: 'currency'
    },

    {key: 'taxCategory', label: 'DESCRIPCIÓN (Categoria)', fieldsTitle: ['description'], fields: ['taxCategory']},
    {
        key: 'engagement',
        label: 'HOJA DE ENCARGO',
        fieldsRef: ['engagement.id'],
        fields: ['engagement.owner.firstName']
    },
    {key: 'withholdingTax', label: 'RETENCION', format: 'currency'}
];
