import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, tap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {HttpRequestBuilder} from "@core/http/http-request-builder";
import {BackendError, isBackendError} from "@core/http/backend-error";
import {WarningDialogComponent} from "@shared/ui/dialogs/warning-dialog.component";
import {MatDialog} from "@angular/material/dialog";

export class HttpViewBuilder {
    static readonly CONNECTION_REFUSE = 0;
    static readonly UNAUTHORIZED = 401;
    private static readonly SNACK_SUCCESS_DURATION = 7000;
    private static readonly SNACK_ERROR_DURATION = 7000;

    private successNotification: string | undefined;
    private errorNotification: string | undefined;
    private readonly builder: HttpRequestBuilder;
    private debugMode = false;
    private warningMode = false;

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

    error(notification: string): this {
        this.errorNotification = notification;
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
                    const safeBlob = blob ?? new Blob([], { type: 'application/pdf' });
                    window.open(window.URL.createObjectURL(safeBlob));
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
        const message = this.errorNotification || notification;
        if (this.warningMode) {
            this.dialog.open(WarningDialogComponent, {
                data: { title: 'Warning', message }
            });
        } else {
            this.snackBar.open(message, 'Error', {
                duration: HttpViewBuilder.SNACK_ERROR_DURATION
            });
        }
        this.errorNotification = undefined;
        this.warningMode = false;
    }

    private handleError(response: HttpErrorResponse): Observable<never> {
        if (response.status === HttpViewBuilder.UNAUTHORIZED) {
            this.showError('Unauthorized');
            void this.router.navigate(['']);
            return throwError(() => response);
        }
        if (response.status === HttpViewBuilder.CONNECTION_REFUSE) {
            this.showError('Network error');
            return throwError(() => response);
        }
        if (isBackendError(response.error)) {
            this.showError(this.formatBackendError(response));
            return throwError(() => response.error);
        }
        this.showError('No response from server');
        return throwError(() => response.error);
    }

    private formatBackendError(response: HttpErrorResponse): string {
        const err = response.error as BackendError;
        const base = `${err.error} (${response.status}): ${err.message}`;
        if (this.debugMode && err.cause) {
            return `${base} — ${err.cause}`;
        }
        return base;
    }
}