import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Observable, tap, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {MatDialog} from "@angular/material/dialog";

import {HttpRequestBuilder} from "@core/http/http-request-builder";
import {BackendError, isBackendError} from "@core/http/backend-error";
import {WarningDialogComponent} from "@shared/ui/dialogs/warning-dialog.component";

export class HttpViewBuilder {
    static readonly CONNECTION_REFUSE = 0;
    static readonly UNAUTHORIZED = 401;
    private static readonly SNACK_SUCCESS_DURATION = 3000;
    private static readonly SNACK_ERROR_DURATION = 3000;

    private successNotification: string | undefined;
    private custonErrorNotification: string | undefined;
    private readonly builder: HttpRequestBuilder;
    private debugMode = false;
    private warningMode = false;
    private silentErrorsMode = false;

    constructor(
        http: HttpClient,
        private readonly snackBar: MatSnackBar,
        private readonly router: Router,
        private readonly dialog: MatDialog
    ) {
        this.builder = new HttpRequestBuilder(http);
    }

    param(key: string, value: string): this {
        this.builder.param(key, value);
        return this;
    }

    paramsFrom(dto: object): this {
        this.builder.paramsFrom(dto);
        return this;
    }

    success(notification = 'Successful'): this {
        this.successNotification = notification;
        return this;
    }

    errorNotification(notification: string): this {
        this.custonErrorNotification = notification;
        return this;
    }

    silentErrors(): this {
        this.silentErrorsMode = true;
        return this;
    }

    post<T>(endpoint: string, body?: object): Observable<T> {
        return this.builder.post<T>(endpoint, body)
            .pipe(
                tap(() => this.notifySuccess()),
                catchError(error => this.handleError(error))
            );
    }

    get<T>(endpoint: string): Observable<T> {
        return this.builder.get<T>(endpoint)
            .pipe(
                tap(() => this.notifySuccess()),
                catchError(error => this.handleError(error))
            );
    }

    put<T>(endpoint: string, body?: object): Observable<T> {
        return this.builder.put<T>(endpoint, body)
            .pipe(
                tap(() => this.notifySuccess()),
                catchError(error => this.handleError(error))
            );
    }

    patch<T>(endpoint: string, body?: object): Observable<T> {
        return this.builder.patch<T>(endpoint, body)
            .pipe(
                tap(() => this.notifySuccess()),
                catchError(error => this.handleError(error))
            );
    }

    delete(endpoint: string): Observable<void> {
        return this.builder.delete(endpoint)
            .pipe(
                tap(() => this.notifySuccess()),
                catchError(error => this.handleError(error))
            );
    }

    openPdf(endpoint: string): Observable<void> {
        return this.builder.getBlob(endpoint)
            .pipe(
                tap(() => this.notifySuccess()),
                map((blob: Blob) => {
                    const safeBlob = blob ?? new Blob([], {type: 'application/pdf'});
                    window.open(window.URL.createObjectURL(safeBlob));
                    return void 0;
                }),
                catchError(err => this.handleError(err))
            );
    }

    openJson(endpoint: string): Observable<void> {
        return this.builder.get<unknown>(endpoint)
            .pipe(
                tap(() => this.notifySuccess()),
                map((json: unknown) => {
                    const content = JSON.stringify(json, null, 2);
                    const url = window.URL.createObjectURL(
                        new Blob([content], {type: 'application/json;charset=utf-8'})
                    );
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'generico.json';
                    link.click();
                    window.URL.revokeObjectURL(url);
                    return void 0;
                }),
                catchError(err => this.handleError(err))
            );
    }

    debug(): this {
        this.debugMode = true;
        return this;
    }

    warning(): this {
        this.warningMode = true;
        return this;
    }

    private notifySuccess(): void {
        if (!this.successNotification) return;
        this.snackBar.open(this.successNotification, '', {
            duration: HttpViewBuilder.SNACK_SUCCESS_DURATION
        });
        this.successNotification = undefined;
    }

    private showError(notification: string): void {
        const message = this.custonErrorNotification || notification;
        if (this.warningMode) {
            this.dialog.open(WarningDialogComponent, {
                data: {title: 'Warning', message}
            });
        } else {
            this.snackBar.open(message, 'Error', {
                duration: HttpViewBuilder.SNACK_ERROR_DURATION
            });
        }
    }

    private handleError(response: HttpErrorResponse): Observable<never> {
        if (response.status === HttpViewBuilder.UNAUTHORIZED) {
            if (!this.silentErrorsMode) this.showError('Unauthorized');
            void this.router.navigate(['']);
            return throwError(() => ({
                error: 'UnauthorizedException',
                message: 'Sesión no autorizada.',
                cause: ''
            } as BackendError));
        }
        if (response.status === HttpViewBuilder.CONNECTION_REFUSE) {
            if (!this.silentErrorsMode) this.showError('Error de Red');
            return throwError(() => ({
                error: 'ConnectionRefusedException',
                message: 'No ha sido posible conectar con el servidor.',
                cause: ''
            } as BackendError));
        }
        if (isBackendError(response.error)) {
            if (!this.silentErrorsMode) this.showBackendError(response.error, response.status);
            return throwError(() => response.error);
        }
        if (!this.silentErrorsMode) this.showError('Ninguna respuesta del servidor');
        return throwError(() => ({
            error: 'UnknownException',
            message: 'Ninguna respuesta del servidor.',
            cause: ''
        } as BackendError));
    }

    private showBackendError(error: BackendError, status: number): void {
        if (this.debugMode) {
            this.snackBar.open(
                `${error.error} (${status}): ${error.message} — ${error.cause}`,
                'Error',
                {duration: HttpViewBuilder.SNACK_ERROR_DURATION}
            );
        }
        if (this.warningMode) {
            this.dialog.open(WarningDialogComponent, {
                data: {title: 'Warning', message: error.message}
            });
        }
        if (!this.debugMode && !this.warningMode) {
            this.snackBar.open(
                `${error.error} (${status}): ${error.message}`,
                'Error',
                {duration: HttpViewBuilder.SNACK_ERROR_DURATION}
            );
        }
    }
}