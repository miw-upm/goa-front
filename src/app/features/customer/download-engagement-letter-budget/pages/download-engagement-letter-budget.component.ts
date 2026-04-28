import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DocumentAcceptanceComponent} from '../../shared/document-acceptance/document-acceptance.component';
import {DownloadEngagementLetterBudgetService} from '../download-engagement-letter-budget.service';

@Component({
    standalone: true,
    selector: 'app-download-engagement-letter-budget',
    templateUrl: './download-engagement-letter-budget.component.html',
    styleUrls: ['./download-engagement-letter-budget.component.scss'],
    imports: [
        FormsModule,
        DocumentAcceptanceComponent
    ]
})
export class DownloadEngagementLetterBudgetComponent implements OnInit {

    private path = '';
    private mobile = '';
    private token = '';

    constructor(
        private readonly downloadEngagementLetterBudgetService: DownloadEngagementLetterBudgetService,
        private readonly route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.path = this.route.snapshot.url[1]?.path ?? '';
        this.mobile = this.route.snapshot.paramMap.get('mobile') ?? '';
        this.token = this.route.snapshot.paramMap.get('token') ?? '';
    }

    onDownload(): void {
        this.downloadEngagementLetterBudgetService
            .downloadDocument(this.path, this.mobile, this.token)
            .subscribe();
    }
}
