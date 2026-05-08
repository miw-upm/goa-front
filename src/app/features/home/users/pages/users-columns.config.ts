import {CrudColumnConfig} from '@shared/ui/crud2/crud-column.config';

export const USERS_COLUMNS: CrudColumnConfig[] = [
    {key: 'cliente', label: 'Clientes', fieldsTitle: ['firstName', 'familyName']},
    {key: 'mobile', label: 'Móvil', fields: ['mobile']},
    {key: 'email', label: 'Email'},
];
