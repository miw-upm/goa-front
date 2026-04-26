import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from "@shared/ui/api/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {SignerDocument} from "./SignerDocument.model";

@Injectable({providedIn: 'root'})
export class SignerDocumentService {

    constructor(private readonly httpService: HttpService) {
    }

    downloadDocument(scope: string, mobile: string, token: string): Observable<void> {
        return this.httpService.request()
            .param("scope", scope)
            .openPdf(ENDPOINTS.engagementLetters.documentView(mobile, token));
    }

    signDocument(path: string, mobile: string, token: string, signerDocument: SignerDocument): Observable<void> {
        return this.httpService.request()
            .success("Documento firmado")
            .patch(ENDPOINTS.engagementLetters.signerDocument(path, mobile, token), signerDocument);
    }
}