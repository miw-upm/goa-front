import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@shared/ui/api/http.service';
import {
    AuthorizationPurposeTemplate
} from '../../home/authorization-purpose-templates/models/authorization-purpose-template.model';

@Injectable({providedIn: 'root'})
export class SharedAuthorizationPurposeTemplateService {
    constructor(private readonly httpService: HttpService) {
    }

    searchPurposes(purpose: string): Observable<AuthorizationPurposeTemplate[]> {
        return this.httpService.request()
            .param('purpose', purpose ?? '')
            .get(ENDPOINTS.authorizationPurposeTemplates.root);
    }

    create(template: AuthorizationPurposeTemplate): Observable<AuthorizationPurposeTemplate> {
        return this.httpService.request()
            .post(ENDPOINTS.authorizationPurposeTemplates.root, template);
    }
}
