import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {environment} from "@env";
import {HttpService} from "@shared/ui/api/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {AccessLink} from "@features/shared/models/access-link.model";
import {AccessLinkCreation} from "@features/shared/models/access-link-creation.model";

@Injectable({providedIn: 'root'})
export class SharedAccessLinkService {
    constructor(private readonly httpService: HttpService) {
    }

    createAccessLink(creation: AccessLinkCreation): Observable<string> {
        return this.httpService.request()
            .post<AccessLink>(ENDPOINTS.accessLink.root, creation)
            .pipe(
                map(accessLint => this.buildAccessUrl(accessLint))
            );
    }

    buildAccessUrl(accessLink: AccessLink): string {
        return `${environment.FRONT_END}/customer/${accessLink.scope}/${accessLink.urlId}/${accessLink.token}`;
    }

}