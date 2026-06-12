export interface LegalProcedure {
    title: string;
    startDate?: Date | string;
    closingDate?: Date | string;
    budget?: number;
    budgetProposal?: string;
    vatIncluded?: boolean;
    legalTasks?: string[];
}
