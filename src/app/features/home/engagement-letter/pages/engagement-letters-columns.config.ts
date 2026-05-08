import {CrudColumnConfig} from '@shared/ui/crud2/crud-column.config';

export const ENGAGEMENT_LETTERS_COLUMNS: CrudColumnConfig[] = [
    {key: 'budgetOnly', label: 'TIPO',
        booleanConfig: {trueLabel: 'Presupuesto', falseLabel: 'Hoja', trueColor: 'primary', falseColor: 'default', showIcon: false}},
    {key: 'owner', label: 'RESPONSABLE', fieldsTitle: ['owner.firstName', 'owner.familyName'], fields: ['owner.mobile']},
    {key: 'legalProcedures', label: 'PROCEDIMIENTOS', arrayField: 'title'},
    {key: 'acceptanceEngagements', label: 'FIRMANTES', arrayField: 'signerFullName'},
    {key: 'signed', label: 'ACEPTDO Y FIRMADO'},
    {key: 'lastUpdatedDate', label: 'ÚLTIMA ACTUALIZACIÓN'}
];
