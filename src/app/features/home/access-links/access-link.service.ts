import {Injectable} from "@angular/core";
import {AccessLink} from "./acces-link.model";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HttpService} from "@core/services/http.service";
import {environment} from "@env";

@Injectable({providedIn: 'root'})
export class AccessLinkService {
    private static readonly ACCESS_LINK = environment.REST_USER + '/access-link';

    constructor(private readonly httpService: HttpService) {
    }

    createAccessLink(accessLink: AccessLink): Observable<AccessLink> {
        return this.httpService.post(AccessLinkService.ACCESS_LINK, accessLink)
            .pipe(
                map(accessLink => {
                    accessLink.value = "http://localhost:4200/customer/edit-profile" + accessLink.value;
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
}