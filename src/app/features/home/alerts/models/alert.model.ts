export interface AlertSummary {
    id?: string;
    title?: string;
    dueDate?: string;
    status?: string;
}

export interface AlertCreate {
    title: string;
    description?: string;
    dueDate: string;
    engagementLetterId: string;
}
