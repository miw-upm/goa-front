import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {CustomerFileDownloadFindCriteria} from "./customer-file-download-find-criteria.model";
import {CustomerFileDownload} from "./customer-file-download.model";


@Injectable({providedIn: 'root'})
export class CustomerFileDownloadService {

    constructor(private readonly httpService: HttpService) {
    }

    search(criteria: CustomerFileDownloadFindCriteria): Observable<CustomerFileDownload[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get<CustomerFileDownload[]>(ENDPOINTS.customerFileDownload.root);
    }

    read(id: string): Observable<CustomerFileDownload> {
        return this.httpService.request().get(ENDPOINTS.customerFileDownload.byId(id));
    }
}