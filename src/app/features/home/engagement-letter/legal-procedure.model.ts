export interface LegalProcedure {
    id?: string;
    title: string;
    startDate?: Date;
    closingDate?: Date;
    budget?: number;
    vatIncluded?: boolean;
    legalTasks?: string[];
}