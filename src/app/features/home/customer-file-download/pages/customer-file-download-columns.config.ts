import {CrudColumnConfig} from '@shared/ui/crud/crud-column.config';

export const CUSTOMER_FILE_DOWNLOAD_COLUMNS: CrudColumnConfig[] = [
    {
        key: 'clientes',
        label: 'CLIENTES',
        fieldsTitle: ['customer.firstName', 'customer.familyName'],
        fields: ['customer.mobile']
    },
    {key: 'downloadedAt', label: 'FECHAS DE DESCARGA'},
    {key: 'documentType', label: 'TIPOS DE DESCARGA'}
];
