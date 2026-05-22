import {CrudColumnConfig} from '@shared/ui/crud/crud-column.config';

export const PAYMENTS_COLUMNS: CrudColumnConfig[] = [
    {key: 'date', label: 'FECHA', format: 'date', dateFormat: 'dd/MM/yyyy'},
    {key: 'client', label: 'CLIENTE', fieldsTitle: ['user.firstName', 'user.familyName'], fields: ['user.mobile']},
    {key: 'engagement', label: 'HOJA DE ENCARGO', fields: ['engagement.id']},
    {key: 'amount', label: 'IMPORTE', format: 'currency'},
    {key: 'method', label: 'METODO'},
];
