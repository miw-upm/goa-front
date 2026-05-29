import {CrudColumnConfig} from "@shared/ui/crud/crud-column.config";
import {EXPENSE_TYPE_LABELS} from "../models/expense-type.model";

export const EXPENSES_COLUMNS: CrudColumnConfig[] = [
    {key: 'issueDate', label: 'FECHA EMISION ', format: 'date', dateFormat: 'dd/MM/yyyy'},
    {key: 'number', label: 'SERIE / NUMERO', fieldsTitle: ['series'], fields: ['number']},
    {
        key: 'expenseType',
        label: 'TIPO',
        format: 'select',
        selectConfig: {
            CAPITAL: {label: EXPENSE_TYPE_LABELS.CAPITAL, color: 'primary'}
        }
    },
    {key: 'supplier', label: 'PROVEEDOR', fieldsTitle: ['supplier.name'], fields: ['supplier.identity']},
    {
        key: 'amounts', label: ' (IVA) BASE / TOTAL',
        fieldsRef: ['vatRate'],
        fieldsTitle: ['baseAmount'],
        fields: ['total'],
        format: 'currency'
    },

    {key: 'taxCategory', label: 'CATEGORIA (Descripción)', fieldsTitle: ['taxCategory'], fields: ['description']},
    {
        key: 'engagement',
        label: 'HOJA DE ENCARGO',
        fieldsRef: ['engagement.id'],
        fieldsTitle: ['engagement.owner.firstName'],
        fields: ['engagement.legalProcedures.0.title']
    },
    {key: 'withholdingTax', label: 'RETENCION', format: 'currency'}
];
