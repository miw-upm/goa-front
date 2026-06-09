import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {CustomerInquiry} from './models/customer-inquiry.model';

@Injectable({providedIn: 'root'})
export class CustomerInquiryService {
    constructor(private readonly httpService: HttpService) {
    }

    create(inquiry: CustomerInquiry): Observable<CustomerInquiry> {
        return this.httpService.request()
            .success()
            .post(ENDPOINTS.inquiries.root, inquiry);
    }

    findAll(): Observable<CustomerInquiry[]> {
        return this.httpService.request()
            .get(ENDPOINTS.inquiries.root);
    }

    readById(id: string): Observable<CustomerInquiry> {
        return this.httpService.request()
            .get(ENDPOINTS.inquiries.byId(id));
    }

    update(id: string, patch: Partial<CustomerInquiry>): Observable<CustomerInquiry> {
        return this.httpService.request()
            .put(ENDPOINTS.inquiries.byId(id), patch);
    }

    delete(id: string): Observable<void> {
        return this.httpService.request()
            .delete(ENDPOINTS.inquiries.byId(id));
    }

    reply(id: string, replyText: string): Observable<CustomerInquiry> {
        return this.httpService.request()
            .patch(ENDPOINTS.inquiries.reply(id), replyText as unknown as object);
    }

    close(id: string): Observable<CustomerInquiry> {
        return this.httpService.request()
            .patch(ENDPOINTS.inquiries.close(id), null);
    }
}