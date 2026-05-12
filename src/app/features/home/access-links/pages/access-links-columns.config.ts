import {CrudColumnConfig} from '@shared/ui/crud/crud-column.config';

export const ACCESS_LINKS_COLUMNS: CrudColumnConfig[] = [
    {key: 'cliente', label: 'CLIENTES', fieldsTitle: ['fullName']},
    {key: 'lastUsedAt', label: 'ÚLTIMA FECHA DE USO'},
    {key: 'expiresAt', label: 'FECHA DE CADUCIDAD', dateFormat: 'EEEE, dd MMMM yyyy'},
    {key: 'remainingUses', label: 'USOS DISPONIBLES'},
    {key: 'scope', label: 'TIPO DE ENLACE'},
];
