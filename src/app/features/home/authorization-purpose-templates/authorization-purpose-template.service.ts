import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@shared/ui/api/http.service';
import {AuthorizationPurposeTemplate} from './models/authorization-purpose-template.model';

@Injectable({providedIn: 'root'})
export class AuthorizationPurposeTemplateService {
    constructor(private readonly httpService: HttpService) {
    }

    create(template: AuthorizationPurposeTemplate): Observable<AuthorizationPurposeTemplate> {
        return this.httpService.request()
            .success()
            .post(ENDPOINTS.authorizationPurposeTemplates.root, template);
    }

    update(id: string, template: AuthorizationPurposeTemplate): Observable<AuthorizationPurposeTemplate> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.authorizationPurposeTemplates.byId(id), template);
    }

    search(purpose: string): Observable<AuthorizationPurposeTemplate[]> {
        return this.httpService.request()
            .param('purpose', purpose)
            .get(ENDPOINTS.authorizationPurposeTemplates.root);
    }

    read(id: string): Observable<AuthorizationPurposeTemplate> {
        return this.httpService.request()
            .get(ENDPOINTS.authorizationPurposeTemplates.byId(id));
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.authorizationPurposeTemplates.byId(id));
    }
}
