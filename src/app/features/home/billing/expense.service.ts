import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {Expense} from './models/expense.model';

@Injectable({providedIn: 'root'})
export class ExpenseService {
	constructor(private readonly httpService: HttpService) {
	}

	create(expense: Expense): Observable<Expense> {
		return this.httpService.request()
			.success()
			.post(ENDPOINTS.expenses.root, expense);
	}

	read(id: string): Observable<Expense> {
			return this.httpService.request()
					.get(ENDPOINTS.expenses.byId(id));
	}

	search(): Observable<Expense[]> {
			return this.httpService.request()
					.get(ENDPOINTS.expenses.root);
    }
}
