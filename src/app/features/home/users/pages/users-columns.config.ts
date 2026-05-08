import {CrudColumnConfig} from '@shared/ui/crud2/crud-column.config';

export const USERS_COLUMNS: CrudColumnConfig[] = [
    {key: 'cliente', label: 'CLIENTES', fieldsTitle: ['firstName', 'familyName']},
    {key: 'mobile', label: 'MÓVIL', fields: ['mobile']},
    {key: 'email', label: 'EMAIL'},
];
