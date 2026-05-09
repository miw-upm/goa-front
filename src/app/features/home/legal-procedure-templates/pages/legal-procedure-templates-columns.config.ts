import {CrudColumnConfig} from '../../../../shared/ui/crud/crud-column.config';

export const LEGAL_PROCEDURE_TEMPLATES_COLUMNS: CrudColumnConfig[] = [
    {key: 'title', label: 'TÍTULO'},
    {key: 'budget', label: 'PRESUPUESTO', format: 'currency'},
    {key: 'legalTasks', label: 'TAREAS', arrayField: 'title'},
];
