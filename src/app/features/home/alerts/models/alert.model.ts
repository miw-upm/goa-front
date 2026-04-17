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

export interface AlertNotificationConfig {
    offsetMinutes: number[];
}

export interface AlertNotification {
    offsetMinutes?: number;
}

export interface AlertDetail {
    id?: string;
    title?: string;
    description?: string;
    dueDate?: string;
    status?: string;
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
