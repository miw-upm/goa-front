import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {environment} from "@env";
import {HttpService} from "@core/http/http.service";
import {AccessLink} from "./acces-link.model";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable()
export class AccessLinkService {
    constructor(private readonly httpService: HttpService) {
    }

    createAccessLink(accessLink: AccessLink): Observable<string> {
        return this.httpService
            .post(ENDPOINTS.accessLink.root, accessLink)
            .pipe(
                map(response => this.createLink(response))
            );
    }

    createLink(accessLink: AccessLink): string {
        let link = `${environment.FRONT_END}/customer/${accessLink.scope}/${accessLink.mobile}/${accessLink.id}`;
        if (accessLink.document) {
            link += `/${accessLink.document}`;
        }
        return link;
    }

    search() {
        return this.httpService.get(ENDPOINTS.accessLink.root);
    }

    delete(id: string) {
        return this.httpService.delete(ENDPOINTS.accessLink.byId(id));
    }

    read(id) {
        return this.httpService.get(ENDPOINTS.accessLink.byId(id));
    }
}