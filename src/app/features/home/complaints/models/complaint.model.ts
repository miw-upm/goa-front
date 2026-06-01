import {Status} from "./status.enum";

export interface Complaint {
    id?: string;
    engagementId: string;
    mobile?: string;
    description: string;
    status: Status;
    createdAt?: string;
}