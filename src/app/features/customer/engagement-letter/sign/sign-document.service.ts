import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ENDPOINTS} from "@core/api/endpoints";
import {HttpService} from "@shared/ui/api/http.service";
import {SignerDocument} from "./sign-document.model";

interface ReadStatus {
    read: boolean;
}

@Injectable({providedIn: 'root'})
export class SignDocumentService {

    constructor(private readonly httpService: HttpService) {
    }

    downloadDocument(scope: string, urlId: string, token: string): Observable<void> {
        return this.httpService.request()
            .openPdf(ENDPOINTS.engagementLetters.readDocument(scope, urlId, token));
    }

    readStatus(scope: string, urlId: string, token: string): Observable<ReadStatus> {
        return this.httpService.request()
            .silentErrors()
            .get<ReadStatus>(ENDPOINTS.engagementLetters.readStatus(scope, urlId, token));
    }

    signDocument(scope: string, urlId: string, token: string, signerDocument: SignerDocument): Observable<void> {
        return this.httpService.request()
            .success("Documento Firmado")
            .silentErrors()
            .warning()
            .patch(ENDPOINTS.engagementLetters.signerDocument(scope, urlId, token), signerDocument);
    }
}
