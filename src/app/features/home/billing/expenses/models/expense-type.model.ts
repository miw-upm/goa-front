export type ExpenseType = 'CURRENT' | 'CAPITAL';

export const EXPENSE_TYPES: ExpenseType[] = ['CURRENT', 'CAPITAL'];

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
    CURRENT: 'Corriente',
    CAPITAL: 'Inversión'
};
