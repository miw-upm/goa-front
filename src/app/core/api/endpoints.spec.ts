import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {environment} from '@env';

import {HttpRequestBuilder} from '@core/http/HttpRequestBuilder';
import {HttpService} from '@core/http/http.service';
import {ENDPOINTS} from './endpoints';

describe('ENDPOINTS', () => {
    it('should build users root and dynamic routes', () => {
        const mobile = '612 34/56?';
        const token = 'token with spaces';

        expect(ENDPOINTS.users.root).toBe(`${environment.REST_USER}/users`);
        expect(ENDPOINTS.users.byMobile(mobile)).toBe(
            `${environment.REST_USER}/users/${encodeURIComponent(mobile)}`
        );
        expect(ENDPOINTS.users.byMobileAndToken(mobile, token)).toBe(
            `${environment.REST_USER}/users/${encodeURIComponent(mobile)}/${encodeURIComponent(token)}`
        );
        expect(ENDPOINTS.users.provinces()).toBe(`${environment.REST_USER}/users/provinces`);
    });

    it('should build access-link routes', () => {
        const id = 'acc id/01';

        expect(ENDPOINTS.accessLink.root).toBe(`${environment.REST_USER}/access-link`);
        expect(ENDPOINTS.accessLink.byId(id)).toBe(
            `${environment.REST_USER}/access-link/${encodeURIComponent(id)}`
        );
    });

    it('should build engagement-letters routes', () => {
        const id = 'eng id/01';

        expect(ENDPOINTS.engagementLetters.root).toBe(`${environment.REST_ENGAGEMENT}/engagement-letters`);
        expect(ENDPOINTS.engagementLetters.byId(id)).toBe(
            `${environment.REST_ENGAGEMENT}/engagement-letters/${encodeURIComponent(id)}`
        );
    });

    it('should build legal-procedure-template routes', () => {
        const id = 'lp id/01';

        expect(ENDPOINTS.legalProcedureTemplates.root).toBe(
            `${environment.REST_ENGAGEMENT}/legal-procedure-templates`
        );
        expect(ENDPOINTS.legalProcedureTemplates.byId(id)).toBe(
            `${environment.REST_ENGAGEMENT}/legal-procedure-templates/${encodeURIComponent(id)}`
        );
    });

    it('should build legal-task routes', () => {
        const id = 'lt id/01';

        expect(ENDPOINTS.legalTasks.root).toBe(`${environment.REST_ENGAGEMENT}/legal-tasks`);
        expect(ENDPOINTS.legalTasks.byId(id)).toBe(
            `${environment.REST_ENGAGEMENT}/legal-tasks/${encodeURIComponent(id)}`
        );
    });

    it('should build issues routes', () => {
        const id = 'issue id/01';

        expect(ENDPOINTS.issues.root).toBe(`${environment.REST_SUPPORT}/issues`);
        expect(ENDPOINTS.issues.byId(id)).toBe(
            `${environment.REST_SUPPORT}/issues/${encodeURIComponent(id)}`
        );
        expect(ENDPOINTS.issues.syncById(id)).toBe(
            `${environment.REST_SUPPORT}/issues/${encodeURIComponent(id)}/sync`
        );
    });

    it('should build expenses root and byId endpoint', () => {
        const id = 'expense id/with special?chars';

        expect(ENDPOINTS.expenses.root).toBe(`${environment.REST_BILLING}/expenses`);
        expect(ENDPOINTS.expenses.byId(id)).toBe(
            `${environment.REST_BILLING}/expenses/${encodeURIComponent(id)}`
        );
    });

    it('should build incomes root and byId endpoint', () => {
        const id = 'income id/with special?chars';

        expect(ENDPOINTS.incomes.root).toBe(`${environment.REST_BILLING}/incomes`);
        expect(ENDPOINTS.incomes.byId(id)).toBe(
            `${environment.REST_BILLING}/incomes/${encodeURIComponent(id)}`
        );
    });
});

describe('HttpService', () => {
    it('should create a request builder with the injected collaborators', () => {
        const httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
        const snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
        const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
        const service = new HttpService(httpSpy, snackBarSpy, routerSpy);

        const request = service.request();

        expect(request).toEqual(jasmine.any(HttpRequestBuilder));
    });
});

describe('HttpRequestBuilder', () => {
    let httpSpy: jasmine.SpyObj<HttpClient>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
    let routerSpy: jasmine.SpyObj<Router>;
    let builder: HttpRequestBuilder;

    beforeEach(() => {
        httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'get', 'put', 'patch', 'delete']);
        snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
        routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
        routerSpy.navigate.and.returnValue(Promise.resolve(true));
        builder = new HttpRequestBuilder(httpSpy, snackBarSpy, routerSpy);
    });

    it('should append params and reset them after a request', () => {
        httpSpy.get.and.returnValues(of({ok: true}), of({ok: true}));

        builder.param('page', '1').get('/items').subscribe();
        builder.get('/items').subscribe();

        const firstOptions = httpSpy.get.calls.argsFor(0)[1] as any;
        const secondOptions = httpSpy.get.calls.argsFor(1)[1] as any;

        expect(firstOptions.headers.get('Accept')).toBe('application/json');
        expect(firstOptions.params.get('page')).toBe('1');
        expect(firstOptions.responseType).toBe('json');
        expect(secondOptions.params.keys()).toEqual([]);
    });

    it('should create params from dto ignoring null and undefined values', () => {
        httpSpy.get.and.returnValue(of([]));

        builder.paramsFrom({name: 'Ana', page: 2, empty: null, missing: undefined}).get('/users').subscribe();

        const options = httpSpy.get.calls.mostRecent().args[1] as any;

        expect(options.params.get('name')).toBe('Ana');
        expect(options.params.get('page')).toBe('2');
        expect(options.params.has('empty')).toBeFalse();
        expect(options.params.has('missing')).toBeFalse();
    });

    it('should show success notification only once when configured', () => {
        httpSpy.get.and.returnValues(of({ok: true}), of({ok: true}));

        builder.success('Saved').get('/ok').subscribe();
        builder.get('/silent').subscribe();

        expect(snackBarSpy.open).toHaveBeenCalledTimes(1);
        expect(snackBarSpy.open).toHaveBeenCalledWith('Saved', '', {
            duration: 1000
        });
    });

    it('should delegate post put patch and delete to the corresponding http methods', () => {
        httpSpy.post.and.returnValue(of({created: true}));
        httpSpy.put.and.returnValue(of({updated: true}));
        httpSpy.patch.and.returnValue(of({patched: true}));
        httpSpy.delete.and.returnValue(of({}));

        let deletedResult = 'pending';

        builder.post('/items', {id: 1}).subscribe(response => {
            expect(response).toEqual({created: true});
        });
        builder.put('/items/1', {id: 1}).subscribe(response => {
            expect(response).toEqual({updated: true});
        });
        builder.patch('/items/1', {id: 1}).subscribe(response => {
            expect(response).toEqual({patched: true});
        });
        builder.delete('/items/1').subscribe(response => {
            deletedResult = String(response);
        });

        expect(httpSpy.post).toHaveBeenCalledWith('/items', {id: 1}, jasmine.any(Object));
        expect(httpSpy.put).toHaveBeenCalledWith('/items/1', {id: 1}, jasmine.any(Object));
        expect(httpSpy.patch).toHaveBeenCalledWith('/items/1', {id: 1}, jasmine.any(Object));
        expect(httpSpy.delete).toHaveBeenCalledWith('/items/1', jasmine.any(Object));
        expect(deletedResult).toBe('undefined');
    });

    it('should open pdf responses in a new window', () => {
        httpSpy.get.and.returnValue(of(null as any));
        const openSpy = spyOn(window, 'open').and.stub();
        const createObjectURLSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:pdf');

        let result = 'pending';
        builder.openPdf('/report').subscribe(response => {
            result = String(response);
        });

        const options = httpSpy.get.calls.mostRecent().args[1] as any;

        expect(options.headers.get('Accept')).toBe('application/pdf, application/json');
        expect(options.responseType).toBe('blob');
        expect(createObjectURLSpy).toHaveBeenCalledWith(jasmine.any(Blob));
        expect(openSpy).toHaveBeenCalledWith('blob:pdf');
        expect(result).toBe('undefined');
    });

    it('should handle unauthorized responses', () => {
        const response = new HttpErrorResponse({status: 401});
        httpSpy.get.and.returnValue(throwError(() => response));
        let thrown: HttpErrorResponse | undefined;

        builder.get('/secure').subscribe({
            error: error => {
                thrown = error;
            }
        });

        expect(thrown).toBe(response);
        expect(snackBarSpy.open).toHaveBeenCalledWith('Unauthorized', 'Error', {
            duration: 7000
        });
        expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    it('should handle connection errors with a custom notification', () => {
        const response = new HttpErrorResponse({status: 0});
        httpSpy.get.and.returnValue(throwError(() => response));
        let thrown: HttpErrorResponse | undefined;

        builder.error('Sin conexion').get('/secure').subscribe({
            error: error => {
                thrown = error;
            }
        });

        expect(thrown).toBe(response);
        expect(snackBarSpy.open).toHaveBeenCalledWith('Sin conexion', 'Error', {
            duration: 7000
        });
    });

    it('should handle structured server errors', () => {
        const serverError = {error: 'Bad Request', message: 'wrong data'};
        const response = new HttpErrorResponse({status: 400, error: serverError});
        httpSpy.get.and.returnValue(throwError(() => response));
        let thrown: unknown;

        builder.get('/items').subscribe({
            error: error => {
                thrown = error;
            }
        });

        expect(thrown).toEqual(serverError);
        expect(snackBarSpy.open).toHaveBeenCalledWith('Bad Request (400): wrong data', 'Error', {
            duration: 7000
        });
    });

    it('should handle missing server payloads', () => {
        const response = new HttpErrorResponse({status: 500, error: null});
        httpSpy.get.and.returnValue(throwError(() => response));
        let thrown: unknown = 'pending';

        builder.get('/items').subscribe({
            error: error => {
                thrown = error;
            }
        });

        expect(thrown).toBeNull();
        expect(snackBarSpy.open).toHaveBeenCalledWith('No response from server', 'Error', {
            duration: 7000
        });
    });
});
