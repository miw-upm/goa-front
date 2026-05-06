import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Complaint } from '@features/shared//models/complaint.model';
import {HttpService} from "@core/http/http.service";

@Injectable({
    providedIn: 'root'
})
export class ComplaintService {
    private readonly URL = `${environment.REST_SANDBOX}/complaints`;

    // 1. Inject HttpService instead of HttpClient
    constructor(private httpService: HttpService) {}

    // 2. Use the builder to attach the token
    create(complaint: Complaint, token: string): Observable<Complaint> {
        return this.httpService.request()
            .bearerAuth(token) // This puts the token in the Header
            .post<Complaint>(this.URL, complaint);
    }

    findAll(token: string): Observable<Complaint[]> {
        return this.httpService.request()
            .bearerAuth(token)
            .get<Complaint[]>(this.URL);
    }

    findByBarcode(barcode: string, token: string): Observable<Complaint[]> {
        return this.httpService.request()
            .bearerAuth(token)
            .get<Complaint[]>(`${this.URL}/barcode/${barcode}`);
    }
}
