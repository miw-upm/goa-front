import {CrudColumnConfig} from '@shared/ui/crud/crud-column.config';

export const CONSENTS_COLUMNS: CrudColumnConfig[] = [
    {key: 'cliente', label: 'CLIENTES', fieldsTitle: ['signerFullName'], fields: ['mobile']},
    {key: 'signatureAt', label: 'FECHA DE ACEPTACIÓN'},
    {key: 'dataProcessingAccepted', label: 'LOPD', booleanConfig: {trueLabel: 'Aceptado', falseLabel: 'Rechazado'}},
    {key: 'promotionsAccepted', label: 'PROMOCIONES'},
];
