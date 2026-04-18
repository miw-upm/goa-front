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

export interface AlertEdit {
    title: string;
    description?: string;
    dueDate: string;
}

export interface AlertNotificationConfig {
    offsetMinutes: number[];
}

export interface AlertNotification {
    id: string;            
    offsetMinutes: number; 
    triggerAt: string;     
    status: string;       
    createdAt: string;  
    updatedAt: string;
}

export interface AlertDetail {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    status: string;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: string;
    updatedBy?: string;
    notifications?: AlertNotification[];
}

export interface PendingAlertNotification {
    notificationId?: string;
    alertId?: string;
    offsetMinutes?: number;
    triggerAt?: string;
    status?: string;
    title?: string;
    description?: string;
    dueDate?: string;
    engagementLetterId?: string;
}
