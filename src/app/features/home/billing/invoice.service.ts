import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {Invoice} from './models/invoice.model';
import {InvoiceSearch} from './models/invoice-search.model';
import {InvoiceCreateRequest} from './models/invoice-create-request.model';
import {InvoiceBreakdown} from "./models/invoice-breakdown.model";

@Injectable({providedIn: 'root'})
export class InvoiceService {
    constructor(private readonly httpService: HttpService) {
    }

    create(invoice: InvoiceCreateRequest): Observable<Invoice> {
        return this.httpService.request()
            .success()
            .post(ENDPOINTS.invoices.root, invoice);
    }

    update(id: string, invoice: InvoiceCreateRequest): Observable<Invoice> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.invoices.byId(id), invoice);
    }

    read(id: string): Observable<Invoice> {
        return this.httpService.request()
            .get(ENDPOINTS.invoices.byId(id));
    }

    readBreakdown(id: string): Observable<InvoiceBreakdown> {
        return this.httpService.request()
            .get(ENDPOINTS.invoices.breakdown(id));
    }

    search(criteria?: InvoiceSearch): Observable<Invoice[]> {
        const request = this.httpService.request();
        if (criteria && Object.keys(criteria).length > 0) {
            request.paramsFrom(criteria);
        }
        return request.get(ENDPOINTS.invoices.root);
    }
}
