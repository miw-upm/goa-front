import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {Income} from './models/income.model';
import {IncomeSearch} from './models/income-search.model';

@Injectable({providedIn: 'root'})
export class IncomeService {
	constructor(private readonly httpService: HttpService) {
	}

	create(income: Income): Observable<Income> {
		return this.httpService.request()
			.success()
			.post(ENDPOINTS.incomes.root, income);
	}

	search(criteria?: IncomeSearch): Observable<Income[]> {
		const request = this.httpService.request();
		if (criteria) {
			request.paramsFrom(criteria);
		}
		return request.get(ENDPOINTS.incomes.root);
	}
}
