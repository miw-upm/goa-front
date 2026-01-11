import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class HttpRequestBuilder {
    static readonly CONNECTION_REFUSE = 0;
    static readonly UNAUTHORIZED = 401;
    private static readonly SNACK_SUCCESS_DURATION = 1000;
    private static readonly SNACK_ERROR_DURATION = 7000;

    private successfulNotification: string | undefined;
    private errorNotification: string | undefined;

    private headers: HttpHeaders = new HttpHeaders();
    private params: HttpParams = new HttpParams();
    private responseType: 'json' | 'blob' = 'json';

    constructor(
        private readonly http: HttpClient,
        private readonly snackBar: MatSnackBar,
        private readonly router: Router
    ) {}

    param(key: string, value: string): this {
        if (value != null) {
            this.params = this.params.append(key, value);
        }
        return this;
    }

    paramsFrom(dto: any): this {
        Object.getOwnPropertyNames(dto)
            .forEach(item => this.param(item, dto[item]));
        return this;
    }

    successful(notification = 'Successful'): this {
        this.successfulNotification = notification;
        return this;
    }

    error(notification: string): this {
        this.errorNotification = notification;
        return this;
    }

    pdf(): this {
        this.responseType = 'blob';
        this.header('Accept', 'application/pdf , application/json');
        return this;
    }

    authBasic(mobile: number, password: string): this {
        return this.header('Authorization', 'Basic ' + btoa(`${mobile}:${password}`));
    }

    header(key: string, value: string): this {
        if (value != null) {
            this.headers = this.headers.append(key, value);
        }
        return this;
    }

    post(endpoint: string, body?: object): Observable<any> {
        return this.http
            .post(endpoint, body, this.createOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    get(endpoint: string): Observable<any> {
        return this.http
            .get(endpoint, this.createOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    put(endpoint: string, body?: object): Observable<any> {
        return this.http
            .put(endpoint, body, this.createOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    patch(endpoint: string, body?: object): Observable<any> {
        return this.http
            .patch(endpoint, body, this.createOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    delete(endpoint: string): Observable<any> {
        return this.http
            .delete(endpoint, this.createOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    private createOptions(): any {
        return {
            headers: this.headers,
            params: this.params,
            responseType: this.responseType,
            observe: 'response'
        };
    }

    private extractData(response: HttpResponse<any>): any {
        if (this.successfulNotification) {
            this.snackBar.open(this.successfulNotification, '', {
                duration: HttpRequestBuilder.SNACK_SUCCESS_DURATION
            });
        }

        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/pdf')) {
            const blob = new Blob([response.body], { type: 'application/pdf' });
            window.open(window.URL.createObjectURL(blob));
            return null;
        }

        return response.body;
    }

    private showError(notification: string): void {
        const message = this.errorNotification || notification;
        this.snackBar.open(message, 'Error', {
            duration: HttpRequestBuilder.SNACK_ERROR_DURATION
        });
    }

    private handleError(response: HttpErrorResponse): Observable<never> {
        if (response.status === HttpRequestBuilder.UNAUTHORIZED) {
            this.showError('Unauthorized');
            void this.router.navigate(['']);
            return EMPTY;
        } else if (response.status === HttpRequestBuilder.CONNECTION_REFUSE) {
            this.showError('Connection Refuse');
            return EMPTY;
        } else {
            const error = response.error;
            if (error?.error && error?.message) {
                this.showError(`${error.error} (${response.status}): ${error.message}`);
                return throwError(() => error);
            }

            this.showError('Not response');
            return throwError(() => response.error);
        }
    }
}
