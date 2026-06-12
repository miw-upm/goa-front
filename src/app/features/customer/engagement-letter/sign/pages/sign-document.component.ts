import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

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
export class SignDocumentComponent implements OnInit {
    @ViewChild(DocumentAcceptanceComponent) acceptance!: DocumentAcceptanceComponent;
    documentDownloaded = false;
    private signing = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly signDocumentService: SignDocumentService
    ) {
    }

    ngOnInit(): void {
        const context = this.routeContext();
        this.signDocumentService.readStatus(context.scope, context.urlId, context.token)
            .subscribe(status => this.documentDownloaded = status.read);
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
        if (this.signing) return;
        this.signing = true;
        this.signDocumentService
            .signDocument(payload.context.scope, payload.context.urlId, payload.context.token, {
                documentAccepted: payload.result.accepted,
                signature: payload.result.signature
            })
            .subscribe({
                complete: () => this.acceptance.markCompleted(),
                error: error => {
                    this.signing = false;
                    this.acceptance.markFailed('Error. Enlace inválido o ya esta Firmado.');
                },
            });
    }

    private routeContext(): { scope: string; urlId: string; token: string } {
        return {
            scope: this.route.snapshot.url[1]?.path ?? '',
            urlId: this.route.snapshot.paramMap.get('urlId') ?? '',
            token: this.route.snapshot.paramMap.get('token') ?? ''
        };
    }
}
