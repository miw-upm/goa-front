import {CrudColumnConfig} from "@shared/ui/crud/crud-column.config";

export const EXPENSES_COLUMNS: CrudColumnConfig[] = [
    {key: 'issueDate', label: 'FECHA EMISION / REGISTRO', format: 'date', dateFormat: 'dd/MM/yyyy'},
    {key: 'supplier', label: 'PROVEEDOR', fieldsTitle: ['supplier.name'], fields: ['supplier.identity']},
    {key: 'amounts', label: 'BASE / TOTAL', fieldsTitle: ['baseAmount'], fields: ['total'], format: 'currency'},
    {key: 'vatRate', label: 'IVA', format: 'percent'},
    {key: 'taxCategory', label: 'CATEGORIA (Descripción)', fieldsTitle: ['taxCategory'], fields: ['description']},
    {
        key: 'engagement',
        label: 'HOJA DE ENCARGO',
        fieldsRef: ['engagement.reference'],
        fieldsTitle: ['engagement.owner.firstName'],
        fields: ['engagement.legalProcedures.0.title']
    },
    {key: 'withholdingTax', label: 'RETENCION', format: 'currency'}
];
