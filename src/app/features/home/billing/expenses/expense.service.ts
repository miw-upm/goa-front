import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ExpenseFindCriteria} from './models/expense-find-criteria.model';
import {Expense} from './models/expense.model';
import {SupplierInfo} from './models/supplier-info.model';
import {HttpService} from "@shared/ui/api/http.service";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable({providedIn: 'root'})
export class ExpenseService {
    constructor(private readonly httpService: HttpService) {
    }

    create(expense: Expense): Observable<void> {
        return this.httpService.request()
            .success()
            .post<void>(ENDPOINTS.expenses.root, expense);
    }

    read(id: string): Observable<Expense> {
        return this.httpService.request()
            .get(ENDPOINTS.expenses.byId(id));
    }

    update(id: string, expense: Expense): Observable<void> {
        return this.httpService.request()
            .success()
            .put<void>(ENDPOINTS.expenses.byId(id), expense);
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.expenses.byId(id));
    }

    search(criteria: ExpenseFindCriteria): Observable<Expense[]> {
        return this.httpService.request()
            .paramsFrom(criteria)
            .get(ENDPOINTS.expenses.root);
    }

    categories(): Observable<string[]> {
        return this.httpService.request()
            .get<{ categories: string[] }>(ENDPOINTS.expenses.categories())
            .pipe(map(response => response.categories));
    }

    searchSuppliers(supplier: string): Observable<SupplierInfo[]> {
        return this.httpService.request()
            .param('supplier', supplier ?? '')
            .get(ENDPOINTS.expenses.suppliers());
    }
}
