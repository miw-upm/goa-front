import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface HttpOptions {
    headers: HttpHeaders;
    params: HttpParams;
    responseType: 'json' | 'blob';
    observe: 'response';
}

@Injectable({providedIn: 'root'})
export class HttpService {
    static readonly CONNECTION_REFUSE = 0;
    static readonly UNAUTHORIZED = 401;
    private headers: HttpHeaders;
    private params: HttpParams;
    private responseType: 'json' | 'blob';
    private successfulNotification: string | undefined;
    private errorNotification: string | undefined;

    constructor(private readonly http: HttpClient, private readonly snackBar: MatSnackBar, private readonly router: Router) {
        this.resetOptions();
    }

    param(key: string, value: string): this {
        if (value != null) {
            this.params = this.params.append(key, value); // This class is immutable
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

    post(endpoint: string, body?: object): Observable<any> {
        return this.http
            .post(endpoint, body, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    get(endpoint: string): Observable<any> {
        return this.http
            .get(endpoint, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    put(endpoint: string, body?: object): Observable<any> {
        return this.http
            .put(endpoint, body, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    patch(endpoint: string, body?: object): Observable<any> {
        return this.http
            .patch(endpoint, body, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    delete(endpoint: string): Observable<any> {
        return this.http
            .delete(endpoint, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error)));
    }

    authBasic(mobile: number, password: string): this {
        return this.header('Authorization', 'Basic ' + btoa('${mobile}:${password}'));
    }

    header(key: string, value: string): this {
        if (value != null) {
            this.headers = this.headers.append(key, value); // This class is immutable
        }
        return this;
    }

    private resetOptions(): void {
        this.headers = new HttpHeaders();
        this.params = new HttpParams();
        this.responseType = 'json';
    }

    private createOptions(): any {
        const options: any = {
            headers: this.headers,
            params: this.params,
            responseType: this.responseType,
            observe: 'response'
        };
        this.resetOptions();
        return options;
    }

    private extractData(response: any): any {
        if (this.successfulNotification) {
            this.snackBar.open(this.successfulNotification, '', {
                duration: 1000
            });
            this.successfulNotification = undefined;
        }
        const contentType = response.headers.get('content-type');
        if (contentType) {
            if (contentType.indexOf('application/pdf') !== -1) {
                const blob = new Blob([response.body], {type: 'application/pdf'});
                window.open(window.URL.createObjectURL(blob));
                return null;
            } else if (contentType.indexOf('application/json') !== -1) {
                return response.body; // with 'text': JSON.parse(response.body);
            }
        } else {
            return response;
        }
    }

    private showError(notification: string): void {
        const message = this.errorNotification || notification;
        this.snackBar.open(message, 'Error', {duration: 7000});
        this.errorNotification = undefined;
    }

    private handleError(response: any): Observable<never> {
        if (response.status === HttpService.UNAUTHORIZED) {
            this.showError('Unauthorized');
            this.router.navigate(['']).then();
            return EMPTY;
        } else if (response.status === HttpService.CONNECTION_REFUSE) {
            this.showError('Connection Refuse');
            return EMPTY;
        } else {
            try {
                const error = response.error; // with 'text': JSON.parse(response.error);
                this.showError(error.error + ' (' + response.status + '): ' + error.message);
                return throwError(() => error);
            } catch (e) {
                this.showError('Not response');
                return throwError(() => response.error);
            }
        }
    }

}
