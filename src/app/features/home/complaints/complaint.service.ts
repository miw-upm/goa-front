import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {Complaint} from './models/complaint.model';

@Injectable({providedIn: 'root'})
export class ComplaintService {
    constructor(private readonly httpService: HttpService) {
    }

    create(complaint: Complaint): Observable<Complaint> {
        return this.httpService.request()
            .success()
            .post(ENDPOINTS.complaints.root, complaint);
    }

    search(): Observable<Complaint[]> {
        return this.httpService.request()
            .get(ENDPOINTS.complaints.root);
    }
}