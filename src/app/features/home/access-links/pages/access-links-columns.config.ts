import {CrudColumnConfig} from '@shared/ui/crud2/crud-column.config';

export const ACCESS_LINKS_COLUMNS: CrudColumnConfig[] = [
    {key: 'cliente', label: 'CLIENTES', fieldsTitle: ['fullName']},
    {key: 'lastUsedAt', label: 'ÚLTIMA FECHA DE USO',  format: 'date', dateFormat: 'dd/MM/yyyy HH:mm'},
    {key: 'expiresAt', label: 'FECHA DE CADUCIDAD', format: 'date', dateFormat: 'EEEE, dd MMMM yyyy'},
    {key: 'remainingUses', label: 'USOS DISPONIBLES'},
    {key: 'scope', label: 'TIPO DE ENLACE'},
];
