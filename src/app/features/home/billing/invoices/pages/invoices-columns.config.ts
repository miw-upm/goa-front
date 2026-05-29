import {CrudColumnConfig} from "@shared/ui/crud/crud-column.config";

export const INVOICES_COLUMNS: CrudColumnConfig[] = [
    {
        key: 'issued',
        label: 'TIPO',
        format: 'boolean',
        booleanConfig: {
            trueLabel: 'FACTURA',
            falseLabel: 'PROFORMA',
            trueColor: 'success',
            falseColor: 'primary',
            showIcon: false
        }
    },
    {key: 'reference', label: 'FACTURA', fieldsTitle: ['series', 'number'], separator: '-'},
    {
        key: 'dates',
        label: 'EMISION / OPERACION',
        fieldsTitle: ['emissionDate'],
        fields: ['operationDate'],
        format: 'date',
        dateFormat: 'dd/MM/yyyy'
    },
    {
        key: 'customer',
        label: 'CLIENTE',
        fieldsTitle: ['billingInfo.fullName']
    },
    {key: 'percentage', label: 'CLIENTE (%)', format: 'percent'},
    {key: 'baseAmount', label: 'BASE', format: 'currency'},
    {key: 'vatRate', label: 'IVA', format: 'percent'},
    {
        key: 'engagement',
        label: 'HOJA DE ENCARGO',
        fieldsRef: ['engagement.id'],
        fieldsTitle: ['engagement.owner.firstName'],
        fields: ['engagement.legalProcedures.0.title']
    }
];
