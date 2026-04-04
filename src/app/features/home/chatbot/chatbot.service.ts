import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {ChatbotMessageRequest, ChatbotMessageResponse} from "./models/chatbot.model";
import {HttpService} from "@core/http/http.service";
import {ENDPOINTS} from "@core/api/endpoints";

@Injectable({ providedIn: 'root' })
export class ChatbotService {

    constructor(private readonly httpService: HttpService) {
    }

    sendMessage(request: ChatbotMessageRequest): Observable<ChatbotMessageResponse> {
        return this.httpService.request()
            .error('No se pudo obtener respuesta del asistente')
            .post(ENDPOINTS.chatbot.messages(), request);
    }
}