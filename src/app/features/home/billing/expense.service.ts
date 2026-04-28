import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@shared/ui/api/http.service';
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

    read(id: string): Observable<Expense> {
        return this.httpService.request()
            .get(ENDPOINTS.expenses.byId(id));
    }

    update(id: string, expense: Expense): Observable<Expense> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.expenses.byId(id), expense);
    }

    search(criteria: ExpenseSearch): Observable<Expense[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.expenses.root);
    }
}
