export enum IssueType {
    BUG = 'BUG',
    IMPROVEMENT = 'IMPROVEMENT'
}

export enum IssueStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
}

export interface IssueCreationRequest {
    title: string | undefined;
    description: string | undefined;
    technicalContext: string | undefined;
    type: IssueType | undefined;
}

export interface IssueResponse {
    id?: string;
    title?: string;
    description?: string;
    technicalContext?: string;
    type?: IssueType;
    status?: IssueStatus;
    createdAt?: string;
    lastUpdatedAt?: string;
    createdByUserId?: string;
    githubIssueId?: string;
    githubIssueUrl?: string;
    message?: string;
    error?: string;
}
