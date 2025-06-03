import {LegalTask} from "../tareas-legales/legal-task.model";

export interface LegalProcedureTemplate {
    id?: string;
    title: string;
    startDate?: Date;
    closingDate?: Date;
    budget?: number;
    vatIncluded?: boolean;
    legalTasks?: LegalTask[];
}