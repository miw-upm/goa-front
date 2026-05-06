import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from '@core/api/endpoints';

@Injectable({
  providedIn: 'root'
})
export class DocumentAiService {
  constructor(private readonly httpService: HttpService) {}

  uploadDocument(file: File, autoclassify: boolean): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('autoclassify', String(autoclassify));
    return this.httpService.request()
        .success('Documento subido con éxito')
        .error('Error al subir el documento')
        .post(ENDPOINTS.documentAi.documents(), formData);
  }

  generateSummary(id: string): Observable<any> {
    return this.httpService.request()
        .success('Resumen generado con éxito')
        .error('Error al generar el resumen')
        .post(ENDPOINTS.documentAi.summary(id));
  }
}
