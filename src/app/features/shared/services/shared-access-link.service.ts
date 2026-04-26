import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {environment} from "@env";
import {HttpService} from "@shared/ui/api/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {AccessLink} from "@features/shared/models/acces-link.model";

@Injectable({providedIn: 'root'})
export class SharedAccessLinkService {
    constructor(private readonly httpService: HttpService) {
    }

    createAccessLink(accessLink: AccessLink): Observable<string> {
        return this.httpService.request()
            .post<AccessLink>(ENDPOINTS.accessLink.root, accessLink)
            .pipe(
                map(response => this.buildAccessUrl(response))
            );
    }

    buildAccessUrl(accessLink: AccessLink): string {
        return `${environment.FRONT_END}/customer/${accessLink.scope}/${accessLink.mobile}/${accessLink.id}`;
    }

}