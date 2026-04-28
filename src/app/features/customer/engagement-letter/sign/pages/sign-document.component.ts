import {Component, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DocumentAcceptanceComponent} from '../../../shared/document-acceptance/document-acceptance.component';
import {DocumentAcceptanceResult} from '../../../shared/document-acceptance/document-acceptance-result.model';
import {SignDocumentService} from '../sign-document.service';

@Component({
    standalone: true,
    selector: 'app-sign-document',
    templateUrl: './sign-document.component.html',
    styleUrls: ['./sign-document.component.scss'],
    imports: [
        FormsModule,
        DocumentAcceptanceComponent
    ]
})
export class SignDocumentComponent {
    @ViewChild(DocumentAcceptanceComponent) acceptance!: DocumentAcceptanceComponent;

    constructor(private readonly signDocumentService: SignDocumentService) {
    }

    onDownload(ctx: { path: string; mobile: string; token: string }): void {
        this.signDocumentService
            .downloadDocument(ctx.path, ctx.mobile, ctx.token)
            .subscribe();
    }

    onSubmit(payload: {
        context: { path: string; mobile: string; token: string };
        result: DocumentAcceptanceResult
    }): void {
        this.signDocumentService
            .signDocument(payload.context.path, payload.context.mobile, payload.context.token, {
                documentAccepted: payload.result.accepted,
                signature: payload.result.signature
            })
            .subscribe(() => this.acceptance.markCompleted());
    }
}
