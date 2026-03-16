import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

import {IssueService} from '../issue.service';

@Component({
    standalone: true,
    selector: 'app-issue-detail',
    imports: [MatButtonModule],
    templateUrl: 'issue-detail.component.html',
    styleUrls: ['issue-detail.component.css']
})
export class IssueDetailComponent {
    issueId: string;
    syncing = false;

    constructor(private readonly route: ActivatedRoute, private readonly issueService: IssueService) {
        this.issueId = this.route.snapshot.paramMap.get('id');
    }

    refresh(): void {
        if (!this.issueId || this.syncing) {
            return;
        }

        this.syncing = true;
        this.issueService.sync(this.issueId).subscribe({
            next: () => {
                this.syncing = false;
            },
            error: () => {
                this.syncing = false;
            }
        });
    }
}
