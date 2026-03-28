import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {Expense} from './models/expense.model';
import {ExpenseSearch} from "./models/expense-search.model";

@Injectable({providedIn: 'root'})
export class ExpenseService {
	constructor(private readonly httpService: HttpService) {
	}

	create(expense: Expense): Observable<Expense> {
		return this.httpService.request()
			.success()
			.post(ENDPOINTS.expenses.root, expense);
	}

    search(criteria: ExpenseSearch): Observable<Expense[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.expenses.root);
    }
}