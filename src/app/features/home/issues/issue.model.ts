import {Role} from '@core/auth/models/role.model';
import {UserDocumentType} from '@features/shared/models/UserDocumentType';

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

export interface IssueCreatedByUser {
    id?: string;
    mobile?: string;
    firstName?: string;
    familyName?: string;
    email?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    province?: string;
    documentType?: UserDocumentType;
    identity?: string;
    role?: Role;
}

export interface IssueResponse {
    id?: string;
    title?: string;
    description?: string;
    technicalContext?: string;
    type?: IssueType;
    status?: IssueStatus;
    createdAt?: string;
    lastUpdateAt?: string;
    createdByUserId?: string;
    createdByUser?: IssueCreatedByUser;
    githubIssueId?: string;
    githubIssueUrl?: string;
    message?: string;
    error?: string;
}
