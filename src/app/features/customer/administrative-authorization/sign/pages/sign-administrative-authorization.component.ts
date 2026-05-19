import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {
    DocumentAcceptanceComponent,
    DocumentAcceptanceContext
} from '../../../shared/document-acceptance/document-acceptance.component';
import {DocumentAcceptanceResult} from '../../../shared/document-acceptance/document-acceptance-result.model';
import {SignAdministrativeAuthorizationService} from '../sign-administrative-authorization.service';

@Component({
    standalone: true,
    selector: 'app-sign-administrative-authorization',
    templateUrl: './sign-administrative-authorization.component.html',
    imports: [
        DocumentAcceptanceComponent
    ]
})
export class SignAdministrativeAuthorizationComponent implements OnInit {
    @ViewChild(DocumentAcceptanceComponent) acceptance!: DocumentAcceptanceComponent;

    authorizationPurpose = '';

    constructor(private readonly route: ActivatedRoute,
                private readonly service: SignAdministrativeAuthorizationService) {
    }

    ngOnInit(): void {
        const context = this.context();
        this.service
            .readAuthorization(context.scope, context.urlId, context.token)
            .subscribe(authorization => this.authorizationPurpose = authorization.authorizationPurpose ?? '');
    }

    onSubmit(payload: {
        context: DocumentAcceptanceContext;
        result: DocumentAcceptanceResult
    }): void {
        this.service
            .signAuthorization(payload.context.scope, payload.context.urlId, payload.context.token, {
                signature: payload.result.signature
            })
            .subscribe({
                complete: () => this.acceptance.markCompleted(),
                error: () => this.acceptance.markFailed()
            });
    }

    private context(): DocumentAcceptanceContext {
        return {
            scope: this.route.snapshot.url[1]?.path ?? 'sign-administrative-authorization',
            urlId: this.route.snapshot.paramMap.get('urlId') ?? '',
            token: this.route.snapshot.paramMap.get('token') ?? ''
        };
    }
}
