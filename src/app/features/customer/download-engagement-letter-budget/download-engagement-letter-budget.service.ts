import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@shared/ui/api/http.service';
import { ENDPOINTS } from '@core/api/endpoints';

@Injectable({ providedIn: 'root' })
export class DownloadEngagementLetterBudgetService {

    constructor(private readonly httpService: HttpService) {
    }

    downloadDocument(scope: string, mobile: string, token: string): Observable<void> {
        return this.httpService.request()
            .param("scope", scope)
            .openPdf(ENDPOINTS.engagementLetters.documentView(mobile, token));
    }
}
