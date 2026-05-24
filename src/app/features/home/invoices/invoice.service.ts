import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@shared/ui/api/http.service';
import {InvoiceCreation} from './models/invoice-creation.model';
import {InvoiceFindCriteria} from './models/invoice-find-criteria.model';
import {Invoice} from './models/invoice.model';

@Injectable({providedIn: 'root'})
export class InvoiceService {
    constructor(private readonly httpService: HttpService) {
    }

    create(creation: InvoiceCreation): Observable<void> {
        return this.httpService.request()
            .success()
            .post<void>(ENDPOINTS.invoices.root, creation);
    }

    read(id: string): Observable<Invoice> {
        return this.httpService.request()
            .get(ENDPOINTS.invoices.byId(id));
    }

    update(id: string, invoice: Invoice): Observable<Invoice> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.invoices.byId(id), invoice);
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.invoices.byId(id));
    }

    search(criteria: InvoiceFindCriteria): Observable<Invoice[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.invoices.root);
    }
}
