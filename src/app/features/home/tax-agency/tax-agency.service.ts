import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@shared/ui/api/http.service';
import {Model130} from './models/model-130.model';
import {Model303} from './models/model-303.model';
import {Quarter} from './models/quarter.model';

@Injectable({providedIn: 'root'})
export class TaxAgencyService {
    constructor(private readonly httpService: HttpService) {
    }

    invoiceIssuedBook(year: number, quarter: Quarter): Observable<void> {
        return this.httpService.request()
            .param('year', String(year))
            .param('quarter', quarter)
            .openCsv(ENDPOINTS.taxAgency.invoiceIssuedBook(), `libro-registro-facturas-expedidas-${year}-${quarter}.csv`);
    }

    receivedBook(year: number, quarter: Quarter): Observable<void> {
        return this.httpService.request()
            .param('year', String(year))
            .param('quarter', quarter)
            .openCsv(ENDPOINTS.taxAgency.receivedBook(), `libro-registro-facturas-recibidas-${year}-${quarter}.csv`);
    }

    model303(year: number, quarter: Quarter): Observable<Model303> {
        return this.httpService.request()
            .param('year', String(year))
            .param('quarter', quarter)
            .get<Model303>(ENDPOINTS.taxAgency.model303());
    }

    model130(year: number, quarter: Quarter): Observable<Model130> {
        return this.httpService.request()
            .param('year', String(year))
            .param('quarter', quarter)
            .get<Model130>(ENDPOINTS.taxAgency.model130());
    }
}
