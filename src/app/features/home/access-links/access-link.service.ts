import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {environment} from "@env";
import {HttpService} from "@common/services/http.service";
import {AccessLink} from "./acces-link.model";

@Injectable()
export class AccessLinkService {
    private static readonly ACCESS_LINK = environment.REST_USER + '/access-link';

    constructor(private readonly httpService: HttpService) {
    }

    createAccessLink(accessLink: AccessLink): Observable<AccessLink> {
        return this.httpService.post(AccessLinkService.ACCESS_LINK, accessLink)
            .pipe(
                map(accessLink => {
                    accessLink.link = environment.FRONT_END + "/customer/edit-profile" + accessLink.link;
                    return accessLink;
                }),
            );
    }

    search() {
        return this.httpService.get(AccessLinkService.ACCESS_LINK);
    }

    delete(id: string) {
        return this.httpService.delete(AccessLinkService.ACCESS_LINK + '/' + id);
    }

    read(id) {
        return this.httpService.get(AccessLinkService.ACCESS_LINK + '/' + id);
    }
}