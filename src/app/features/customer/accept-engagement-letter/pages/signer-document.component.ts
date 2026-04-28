import {DocumentAcceptanceResult} from "../../shared/document-acceptance/document-acceptance-result.model";
import {ActivatedRoute} from "@angular/router";
import {SignerDocumentService} from "../signer-document.service";
import {Component, OnInit, ViewChild} from "@angular/core";
import {DocumentAcceptanceComponent} from "../../shared/document-acceptance/document-acceptance.component";
import {FormsModule} from "@angular/forms";
import {SharedCustomerService} from "@features/shared/services/shared-customer.service";

@Component({
    standalone: true,
    selector: 'app-signer-document',
    templateUrl: './signer-document.component.html',
    styleUrls: ['./signer-document.component.scss'],
    imports: [
        FormsModule,
        DocumentAcceptanceComponent
    ]
})
export class SignerDocumentComponent implements OnInit {
    @ViewChild(DocumentAcceptanceComponent) acceptance!: DocumentAcceptanceComponent;

    customerName = 'Cliente';
    private path = '';
    private mobile = '';
    private token = '';

    constructor(
        private readonly signerDocumentService: SignerDocumentService,
        private readonly route: ActivatedRoute,
        private readonly sharedCustomerService: SharedCustomerService
    ) {
    }

    ngOnInit(): void {
        this.path = this.route.snapshot.url[1]?.path ?? '';
        this.mobile = this.route.snapshot.paramMap.get('mobile') ?? '';
        this.token = this.route.snapshot.paramMap.get('token') ?? '';
    }

    onDownload(): void {
        this.signerDocumentService
            .downloadDocument(this.path, this.mobile, this.token)
            .subscribe();
    }

    onSubmit(result: DocumentAcceptanceResult): void {
        this.signerDocumentService
            .signDocument(this.path, this.mobile, this.token, {
                documentAccepted: result.accepted,
                signature: result.signature
            })
            .subscribe(() => this.acceptance.markCompleted());
    }
}