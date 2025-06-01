import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {ProcedimientoLegal} from './procedimiento-legal.model';
import {HttpService} from "@core/services/http.service";
import {ProcedimientoLegalSearch} from "./procedimiento-legal-search.model";
import {environment} from "@env";

@Injectable({providedIn: 'root'})
export class ProcedimientoLegalService {
    private static readonly API_URL = environment.REST_ENCARGO + '/procedimientos-legales';

    constructor(private readonly httpService: HttpService) {
    }

    create(procedimiento: ProcedimientoLegal): Observable<ProcedimientoLegal> {
        return this.httpService
            .post(ProcedimientoLegalService.API_URL, procedimiento);
    }

    update(id: string, procedimiento: ProcedimientoLegal): Observable<ProcedimientoLegal> {
        return this.httpService
            .successful()
            .put(ProcedimientoLegalService.API_URL + `/${id}`, procedimiento);
    }

    search(procedimientoLegalSearch: ProcedimientoLegalSearch): Observable<ProcedimientoLegal[]> {
        return this.httpService
            .paramsFrom(procedimientoLegalSearch)
            .get(ProcedimientoLegalService.API_URL);
    }

    getById(id: string): Observable<ProcedimientoLegal> {
        return this.httpService
            .get(ProcedimientoLegalService.API_URL + `/${id}`);
    }

    delete(id: string): Observable<void> {
        return this.httpService
            .successful()
            .delete(ProcedimientoLegalService.API_URL + `/${id}`);
    }

    read(id: string) {
        return this.httpService
            .get(ProcedimientoLegalService.API_URL + '/' + `/${id}`);
    }
}
