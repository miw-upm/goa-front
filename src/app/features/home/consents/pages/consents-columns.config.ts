import {CrudColumnConfig} from '@shared/ui/crud2/crud-column.config';

export const CONSENTS_COLUMNS: CrudColumnConfig[] = [
    {key: 'cliente', label: 'CLIENTES', fieldsTitle: ['signerFullName'], fields: ['mobile']},
    {key: 'signatureAt', label: 'FECHA DE ACEPTACIÓN', format: 'date', dateFormat: 'dd/MM/yyyy HH:mm'},
    {
        key: 'dataProcessingAccepted', label: 'LOPD',
        format: 'boolean', booleanConfig:
            {trueLabel: 'Aceptado', falseLabel: 'Rechazado', trueColor: 'green', falseColor: 'red'}
    },
    {
        key: 'promotionsAccepted', label: 'PROMOCIONES',
        format: 'boolean', booleanConfig:
            {trueLabel: 'Aceptado', falseLabel: 'Rechazado', trueColor: 'green', falseColor: 'red'}
    }
];
