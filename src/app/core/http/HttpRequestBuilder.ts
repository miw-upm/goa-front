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

    private params: HttpParams = new HttpParams();

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

    post(endpoint: string, body?: object): Observable<any> {
        return this.http
            .post(endpoint, body, this.jsonOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    get(endpoint: string): Observable<any> {
        return this.http
            .get(endpoint, this.jsonOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    put(endpoint: string, body?: object): Observable<any> {
        return this.http
            .put(endpoint, body, this.jsonOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    patch(endpoint: string, body?: object): Observable<any> {
        return this.http
            .patch(endpoint, body, this.jsonOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    delete(endpoint: string): Observable<any> {
        return this.http
            .delete(endpoint, this.jsonOptions())
            .pipe(
                map((response: any) => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    openPdf(endpoint: string): Observable<void> {
        return this.http
            .get(endpoint, this.blobOptions())
            .pipe(
                map((res: HttpResponse<Blob>) => {
                    this.notifySuccess();
                    const blob = res.body ?? new Blob();
                    window.open(window.URL.createObjectURL(blob));
                    return void 0;
                }),
                catchError(err => this.handleError(err))
            );
    }

    private extractData(response: HttpResponse<any>): any {
        this.notifySuccess();
        return response.body;
    }

    private jsonOptions() {
        const headers = new HttpHeaders().set('Accept', 'application/json');
        const options = {
            headers,
            params: this.params,
            responseType: 'json' as const,
            observe: 'response' as const,
        };
        this.params = new HttpParams();
        return options;
    }

    private blobOptions() {
        const headers = new HttpHeaders().set('Accept', 'application/pdf, application/json');
        const options = {
            headers,
            params: this.params,
            responseType: 'blob' as const,
            observe: 'response' as const,
        };
        this.params = new HttpParams();
        return options;
    }

    private notifySuccess(): void {
        if (!this.successfulNotification) return;

        this.snackBar.open(this.successfulNotification, '', {
            duration: HttpRequestBuilder.SNACK_SUCCESS_DURATION
        });
        this.successfulNotification = undefined;
    }

    private showError(notification: string): void {
        const message = this.errorNotification || notification;
        this.snackBar.open(message, 'Error', {
            duration: HttpRequestBuilder.SNACK_ERROR_DURATION
        });
        this.errorNotification = undefined;
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
