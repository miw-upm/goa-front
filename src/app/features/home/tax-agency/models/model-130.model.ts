import {Quarter} from './quarter.model';

export interface Model130 {
    year: number;
    quarter: Quarter;
    netIncomeBreakdown: NetIncomeBreakdown;
}

export interface NetIncomeBreakdown {
    income: number;
    currentExpenses: number;
    investmentAmortization: number;
    withholdings: number;
}

