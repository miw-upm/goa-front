import {CrudColumnConfig} from '@shared/ui/crud/crud-column.config';

export const EXPENSES_COLUMNS: CrudColumnConfig[] = [
    {key: 'issueDate', label: 'FECHA', format: 'date', dateFormat: 'dd/MM/yyyy'},
    {key: 'supplier', label: 'PROVEEDOR', fieldsTitle: ['supplier.name'], fields: ['supplier.identity']},
    {key: 'taxCategory', label: 'CATEGORIA'},
    {key: 'baseAmount', label: 'BASE', format: 'currency'},
    {key: 'vatRate', label: 'IVA (%)', format: 'number'},
    {key: 'withholdingTax', label: 'RETENCION', format: 'currency'},
    {key: 'description', label: 'DESCRIPCION'},
];
