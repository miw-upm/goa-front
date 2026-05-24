import {CrudColumnConfig} from '@shared/ui/crud/crud-column.config';

export const PAYMENTS_COLUMNS: CrudColumnConfig[] = [
    {key: 'date', label: 'FECHA', format: 'date', dateFormat: 'dd/MM/yyyy'},
    {key: 'user', label: 'CLIENTE', fieldsTitle: ['user.firstName'], fields: ['user.familyName']},
    {key: 'amount', label: 'IMPORTE', format: 'currency'},
    {key: 'invoiced', label: 'FACTURADO'},
    {
        key: 'engagement',
        label: 'HOJA DE ENCARGO (Responsable)',
        fieldsTitle: ['engagement.owner.firstName'],
        fields: ['engagement.lastUpdatedDate']
    },
    {key: 'engagement.legalProcedures', label: 'HOJA DE ENCARGO (Procedimientos)', arrayField: 'title'},
    {key: 'method', label: 'METODO'},
];
