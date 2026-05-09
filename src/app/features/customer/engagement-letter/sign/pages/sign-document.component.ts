import {Component, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {SignDocumentService} from '../sign-document.service';
import {DocumentAcceptanceComponent} from '../../../shared/document-acceptance/document-acceptance.component';
import {DocumentAcceptanceResult} from '../../../shared/document-acceptance/document-acceptance-result.model';

@Component({
    standalone: true,
    selector: 'app-sign-document',
    templateUrl: './sign-document.component.html',
    imports: [
        FormsModule,
        DocumentAcceptanceComponent
    ]
})
export class SignDocumentComponent {
    @ViewChild(DocumentAcceptanceComponent) acceptance!: DocumentAcceptanceComponent;

    constructor(private readonly signDocumentService: SignDocumentService) {
    }

    onDownload(ctx: { scope: string; urlId: string; token: string }): void {
        this.signDocumentService
            .downloadDocument(ctx.scope, ctx.urlId, ctx.token)
            .subscribe();
    }

    onSubmit(payload: {
        context: { scope: string; urlId: string; token: string };
        result: DocumentAcceptanceResult
    }): void {
        this.signDocumentService
            .signDocument(payload.context.scope, payload.context.urlId, payload.context.token, {
                documentAccepted: payload.result.accepted,
                signature: payload.result.signature
            })
            .subscribe({
                complete: () => this.acceptance.markCompleted(),
                error: () => this.acceptance.markFailed()
            });
    }
}
