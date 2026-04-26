import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@shared/ui/api/http.service';
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

    read(id: string): Observable<Income> {
        return this.httpService.request()
            .get(ENDPOINTS.incomes.byId(id));
    }

    update(id: string, income: Income): Observable<Income> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.incomes.byId(id), income);
    }

    search(criteria?: IncomeSearch): Observable<Income[]> {
        const request = this.httpService.request();
        if (criteria) {
            request.paramsFrom(criteria);
        }
        return request.get(ENDPOINTS.incomes.root);
    }
}
