import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DocumentAcceptanceComponent} from '../../../shared/document-acceptance/document-acceptance.component';
import {ReadEngagementLetterService} from '../read-engagement-letter.service';

@Component({
    standalone: true,
    selector: 'app-read-engagement-letter',
    templateUrl: './read-engagement-letter.component.html',
    styleUrls: ['./read-engagement-letter.component.scss'],
    imports: [
        FormsModule,
        DocumentAcceptanceComponent
    ]
})
export class ReadEngagementLetterComponent {

    constructor(private readonly readEngagementLetterService: ReadEngagementLetterService) {
    }

    onDownload(ctx: { path: string; mobile: string; token: string }): void {
        this.readEngagementLetterService
            .downloadDocument(ctx.path, ctx.mobile, ctx.token)
            .subscribe();
    }
}
