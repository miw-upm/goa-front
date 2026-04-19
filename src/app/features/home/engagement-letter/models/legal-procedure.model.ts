export interface LegalProcedure {
    title: string;
    startDate?: Date | string;
    closingDate?: Date | string;
    budget?: number;
    vatIncluded?: boolean;
    legalTasks?: string[];
}