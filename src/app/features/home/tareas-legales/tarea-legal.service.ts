import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from "@env";
import {HttpService} from '@core/services/http.service';
import {TareaLegal} from "./tarea-legal.model";
import {TareaLegalSearch} from "./tarea-legal-search.model";

@Injectable({providedIn: 'root'})
export class TareaLegalService {
    private static readonly TAREAS_LEGALES = environment.REST_ENCARGO + '/tareas-legales';

    constructor(private readonly httpService: HttpService) {
    }

    create(tareaLegal: TareaLegal): Observable<TareaLegal> {
        return this.httpService
            .post(TareaLegalService.TAREAS_LEGALES, tareaLegal);
    }

    update(id: string, tareaLegal: TareaLegal): Observable<TareaLegal> {
        return this.httpService
            .successful()
            .put(TareaLegalService.TAREAS_LEGALES + '/' + id, tareaLegal);
    }

    search(tareaLegalSearch: TareaLegalSearch): Observable<TareaLegal[]> {
        return this.httpService
            .paramsFrom(tareaLegalSearch)
            .get(TareaLegalService.TAREAS_LEGALES)
    }


    delete(id: string) {
        return this.httpService
            .successful()
            .delete(TareaLegalService.TAREAS_LEGALES + '/' + id);
    }
}
