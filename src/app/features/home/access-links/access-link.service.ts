import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpService} from "@core/http/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {AccessLink} from "@features/shared/models/acces-link.model";
import {SharedAccessLinkService} from "@features/shared/services/shared-access-link.service";
import {AccessLinkFindCriteria} from "./pages/access-link-find-criteria.model";

@Injectable({providedIn: 'root'})
export class AccessLinkService {
    constructor(private readonly httpService: HttpService, private readonly sharedAccessLinkService: SharedAccessLinkService) {
    }

    createAccessLink(accessLink: AccessLink): Observable<string> {
        return this.sharedAccessLinkService.createAccessLink(accessLink);
    }

    buildAccessUrl(accessLink: AccessLink) {
        return this.sharedAccessLinkService.buildAccessUrl(accessLink);
    }

    search(criteria: AccessLinkFindCriteria): Observable<AccessLink[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get<AccessLink[]>(ENDPOINTS.accessLink.root);
    }

    delete(id: string) {
        return this.httpService.request().delete(ENDPOINTS.accessLink.byId(id));
    }

    read(id) {
        return this.httpService.request().get(ENDPOINTS.accessLink.byId(id));
    }


}