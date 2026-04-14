import {IssueStatus, IssueType} from "./issue.model";

export class IssueSearch {
    issueId?: string;
    title?: string;
    type?: IssueType;
    status?: IssueStatus;
    createdAt?: string;
}