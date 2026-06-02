import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {PaymentFindCriteria} from './models/payment-find-criteria.model';
import {Payment} from './models/payment.model';
import {ENDPOINTS} from "@core/api/endpoints";
import {HttpService} from "@shared/ui/api/http.service";

@Injectable({providedIn: 'root'})
export class PaymentService {
    constructor(private readonly httpService: HttpService) {
    }

    create(payment: Payment): Observable<Payment> {
        return this.httpService.request()
            .success()
            .post(ENDPOINTS.payments.root, payment);
    }

    read(id: string): Observable<Payment> {
        return this.httpService.request()
            .get(ENDPOINTS.payments.byId(id));
    }

    update(id: string, payment: Payment): Observable<Payment> {
        return this.httpService.request()
            .success()
            .put(ENDPOINTS.payments.byId(id), payment);
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .success()
            .delete(ENDPOINTS.payments.byId(id));
    }

    search(criteria?: PaymentFindCriteria): Observable<Payment[]> {
        const request = this.httpService.request();
        if (criteria) {
            request.paramsFrom(criteria);
        }
        return request.get(ENDPOINTS.payments.root);
    }
}
