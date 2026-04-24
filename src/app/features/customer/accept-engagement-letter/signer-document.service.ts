import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpService} from "@core/http/http.service";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable({ providedIn: 'root' })
export class SignerDocumentService {

    constructor(private readonly httpService: HttpService) {
    }

    downloadDocument(path: string, mobile: string, token: string) : Observable<void> {
        return this.httpService.request().get(ENDPOINTS.engagementLetters.signerDocument(mobile, token));
    }
}