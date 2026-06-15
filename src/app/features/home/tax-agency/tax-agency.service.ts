import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@shared/ui/api/http.service';
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
}

