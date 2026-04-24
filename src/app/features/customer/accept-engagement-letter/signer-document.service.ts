import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpService} from "@core/http/http.service";
import {ENDPOINTS} from "@core/api/endpoints";
import {SignerDocument} from "./SignerDocument.model";

@Injectable({ providedIn: 'root' })
export class SignerDocumentService {

    constructor(private readonly httpService: HttpService) {
    }

    downloadDocument(path: string, mobile: string, token: string) : Observable<void> {
        return this.httpService.request()
            .openPdf(ENDPOINTS.engagementLetters.signerDocument(path, mobile, token));
    }

    acceptDocument(path: string, mobile: string, token: string, signerDocument: SignerDocument) :Observable<void> {
        return this.httpService.request()
            .success("DOCUMENTO FIRMADO!!!")
            .put(ENDPOINTS.engagementLetters.signerDocument(path, mobile, token), signerDocument);
    }
}