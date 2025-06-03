import {LegalTask} from "../tareas-legales/legal-task.model";

export interface LegalProcedureTemplate {
    id?: string;
    title: string;
    budget?: number;
    legalTasks?: LegalTask[];
}