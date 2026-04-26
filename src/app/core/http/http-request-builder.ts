import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class HttpRequestBuilder {
    private params: HttpParams = new HttpParams();

    constructor(private readonly http: HttpClient) {}

    param(key: string, value: string): this {
        if (value != null) this.params = this.params.append(key, value);
        return this;
    }

    paramsFrom(dto: object): this {
        Object.entries(dto).forEach(([key, value]) => {
            if (value !== null && value !== undefined) this.param(key, String(value));
        });
        return this;
    }

    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(endpoint, this.jsonOptions());
    }

    post<T>(endpoint: string, body?: object): Observable<T> {
        return this.http.post<T>(endpoint, body, this.jsonOptions());
    }

    put<T>(endpoint: string, body?: object): Observable<T> {
        return this.http.put<T>(endpoint, body, this.jsonOptions());
    }

    patch<T>(endpoint: string, body?: object): Observable<T> {
        return this.http.patch<T>(endpoint, body, this.jsonOptions());
    }

    delete(endpoint: string): Observable<void> {
        return this.http.delete<void>(endpoint, this.jsonOptions()).pipe(map(() => void 0));
    }

    getBlob(endpoint: string): Observable<Blob> {
        return this.http.get(endpoint, this.blobOptions());
    }

    private jsonOptions() {
        return {
            headers: new HttpHeaders().set('Accept', 'application/json'),
            params: this.params,
            responseType: 'json' as const,
        };
    }

    private blobOptions() {
        return {
            headers: new HttpHeaders().set('Accept', 'application/pdf, application/json'),
            params: this.params,
            responseType: 'blob' as const,
        };
    }
}