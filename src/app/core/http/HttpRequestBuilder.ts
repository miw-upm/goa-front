import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

export class HttpRequestBuilder {
    static readonly CONNECTION_REFUSE = 0;
    static readonly UNAUTHORIZED = 401;
    private static readonly SNACK_SUCCESS_DURATION = 1000;
    private static readonly SNACK_ERROR_DURATION = 7000;

    private successNotification: string | undefined;
    private errorNotification: string | undefined;

    private params: HttpParams = new HttpParams();

    constructor(
        private readonly http: HttpClient,
        private readonly snackBar: MatSnackBar,
        private readonly router: Router
    ) {
    }

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

    success(notification = 'Successful'): this {
        this.successNotification = notification;
        return this;
    }

    error(notification: string): this {
        this.errorNotification = notification;
        return this;
    }

    post<T>(endpoint: string, body?: object): Observable<T> {
        return this.http
            .post<T>(endpoint, body, this.jsonOptions())
            .pipe(
                map((response: HttpResponse<T>) => this.extractData<T>(response)),
                catchError(error => this.handleError(error))
            );
    }

    get<T>(endpoint: string): Observable<T> {
        return this.http
            .get<T>(endpoint, this.jsonOptions())
            .pipe(
                map((response: HttpResponse<T>) => this.extractData<T>(response)),
                catchError(error => this.handleError(error))
            );
    }

    put<T>(endpoint: string, body?: object): Observable<T> {
        return this.http
            .put<T>(endpoint, body, this.jsonOptions())
            .pipe(
                map((response: HttpResponse<T>) => this.extractData<T>(response)),
                catchError(error => this.handleError(error))
            );
    }

    patch<T>(endpoint: string, body?: object): Observable<T> {
        return this.http
            .patch<T>(endpoint, body, this.jsonOptions())
            .pipe(
                map((response: HttpResponse<T>) => this.extractData<T>(response)),
                catchError(error => this.handleError(error))
            );
    }

    delete(endpoint: string): Observable<void> {
        return this.http
            .delete<void>(endpoint, this.jsonOptions())
            .pipe(
                map(() => {
                    this.notifySuccess();
                    return void 0;
                }),
                catchError(error => this.handleError(error))
            );
    }

    openPdf(endpoint: string): Observable<void> {
        return this.http
            .get(endpoint, this.blobOptions())
            .pipe(
                map((res: HttpResponse<Blob>) => {
                    this.notifySuccess();
                    const blob = res.body ?? new Blob([], {type: 'application/pdf'});
                    window.open(window.URL.createObjectURL(blob));
                    return void 0;
                }),
                catchError(err => this.handleError(err))
            );
    }

    private extractData<T>(response: HttpResponse<T>): T {
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
        if (!this.successNotification) return;
        this.snackBar.open(this.successNotification, '', {
            duration: HttpRequestBuilder.SNACK_SUCCESS_DURATION
        });
        this.successNotification = undefined;
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
            this.showError('Network error');
            return EMPTY;
        } else {
            const error = response.error;
            if (error?.error && error?.message) {
                this.showError(`${error.error} (${response.status}): ${error.message}`);
                return throwError(() => error);
            }

            this.showError('Not response from server');
            return throwError(() => response.error);
        }
    }
}
