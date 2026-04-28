import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from "@shared/ui/api/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {SignerDocument} from "./sign-document.model";

@Injectable({providedIn: 'root'})
export class SignDocumentService {

    constructor(private readonly httpService: HttpService) {
    }

    downloadDocument(scope: string, mobile: string, token: string): Observable<void> {
        return this.httpService.request()
            .openPdf(ENDPOINTS.engagementLetters.readDocument(scope, mobile, token));
    }

    signDocument(scope: string, mobile: string, token: string, signerDocument: SignerDocument): Observable<void> {
        return this.httpService.request()
            .success("Documento firmado")
            .patch(ENDPOINTS.engagementLetters.signerDocument(scope, mobile, token), signerDocument);
    }
}