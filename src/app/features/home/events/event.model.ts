export enum EventType {
    MILESTONE = 'MILESTONE',
    PHASES = 'PHASES',
    STANDARD_EVENT = 'STANDARD_EVENT'
}

export enum EventStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface EventResponse {
    id?: string;
    createdDate?: string;
    eventDate?: string;
    type?: EventType;
    title?: string;
    description?: string;
    status?: EventStatus;
    engagementLetterId?: string;
}

export interface EventCreate {
    eventDate?: string;
    type: EventType;
    title: string;
    description?: string;
    status: EventStatus;
    engagementLetterId: string;
}


