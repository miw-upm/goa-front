import {Injectable} from '@angular/core';

import {environment} from "@env";
import {HttpService} from '@core/services/http.service';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class SharedTareaLegalService {
    private static readonly TAREAS_LEGALES = environment.REST_ENCARGO + '/tareas-legales';

    constructor(private readonly httpService: HttpService) {
    }

    searchTareas(titulo: string): Observable<string[]> {
        return this.httpService
            .param("titulo", titulo ?? '')
            .get(SharedTareaLegalService.TAREAS_LEGALES)
            .pipe(
                map(tareas =>
                    tareas.map((tarea => `${tarea.titulo}`))
                )
            )
    }
}
