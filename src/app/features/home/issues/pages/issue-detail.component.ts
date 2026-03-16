import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {CapitalizeEnumNamePipe} from '@shared/pipes/capitalize-enum-name.pipe';

import {IssueResponse, IssueStatus} from '../issue.model';
import {IssueService} from '../issue.service';

@Component({
    standalone: true,
    selector: 'app-issue-detail',
    imports: [CommonModule, MatButtonModule, CapitalizeEnumNamePipe],
    templateUrl: 'issue-detail.component.html',
    styleUrls: ['issue-detail.component.css']
})
export class IssueDetailComponent {
    issueId: string;
    loading = false;
    syncing = false;
    issue: IssueResponse | undefined;
    localErrorMessage: string | undefined;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly issueService: IssueService
    ) {
        this.issueId = this.route.snapshot.paramMap.get('id');
        this.loadIssue();
    }

    loadIssue(): void {
        if (!this.issueId || this.loading) {
            return;
        }

        this.loading = true;
        this.localErrorMessage = undefined;

        this.issueService.read(this.issueId).subscribe({
            next: (issueResponse) => {
                this.issue = issueResponse;
                this.loading = false;
            },
            error: (errorResponse) => {
                this.loading = false;
                this.issue = undefined;
                this.localErrorMessage = this.extractErrorMessage(errorResponse, 'No se pudo cargar la incidencia.');
            }
        });
    }

    refresh(): void {
        if (!this.issueId || this.syncing) {
            return;
        }

        this.syncing = true;
        this.issueService.sync(this.issueId).subscribe({
            next: () => {
                this.syncing = false;
                this.loadIssue();
            },
            error: (errorResponse) => {
                this.syncing = false;
                this.localErrorMessage = this.extractErrorMessage(errorResponse, 'No se pudo sincronizar la incidencia.');
            }
        });
    }

    statusClass(): string {
        if (this.issue?.status === IssueStatus.FINISHED) {
            return 'status-finished';
        }
        if (this.issue?.status === IssueStatus.IN_PROGRESS) {
            return 'status-progress';
        }
        return 'status-pending';
    }

    enumTagClass(value: string | undefined, prefix: string): string {
        if (!value) {
            return `${prefix}-unknown`;
        }
        return `${prefix}-${value.toLowerCase().replaceAll('_', '-')}`;
    }

    private extractErrorMessage(errorResponse: any, fallback: string): string {
        if (!errorResponse) {
            return fallback;
        }

        if (typeof errorResponse === 'string') {
            return errorResponse;
        }

        if (errorResponse.message && errorResponse.error) {
            return `${errorResponse.error}: ${errorResponse.message}`;
        }

        if (errorResponse.message) {
            return errorResponse.message;
        }

        if (errorResponse.error?.message) {
            return errorResponse.error.message;
        }

        return fallback;
    }
}
