import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {Invoice} from './models/invoice.model';

@Injectable({providedIn: 'root'})
export class InvoiceService {
	constructor(private readonly httpService: HttpService) {}

	search(criteria: { engagementId?: string }): Observable<Invoice[]> {
		const request = this.httpService.request();
		if (criteria?.engagementId) {
			request.paramsFrom(criteria);
		}
		return request.get(ENDPOINTS.invoices.root);
	}
}