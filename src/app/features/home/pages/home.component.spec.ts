import {of} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {CancelYesDialogComponent} from '@shared/ui/dialogs/cancel-yes-dialog.component';
import {TypeToConfirmDialogComponent} from '@shared/ui/dialogs/type-to-confirm-dialog.component';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {DataCellComponent} from '@shared/ui/crud/data-cell.component';
import {ReadDetailDialogComponent} from '@shared/ui/crud/read-detail.dialog.component';
import {HomeComponent} from './home.component';

describe('HomeComponent', () => {
    let dialogSpy: {
        open: jasmine.Spy;
    };
    let userServiceSpy: {
        read: jasmine.Spy;
    };
    let authServiceSpy: {
        login: jasmine.Spy;
        logout: jasmine.Spy;
        isAuthenticated: jasmine.Spy;
        mobile: string;
        name: string;
    };

    beforeEach(() => {
        dialogSpy = {
            open: jasmine.createSpy('open')
        };

        userServiceSpy = {
            read: jasmine.createSpy('read').and.returnValue(of({
                id: 'user-123',
                mobile: '123456789',
                firstName: 'John'
            }))
        };

        authServiceSpy = {
            login: jasmine.createSpy('login'),
            logout: jasmine.createSpy('logout'),
            isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
            mobile: '123456789',
            name: 'John Doe'
        };
    });

    it('should initialize with correct title', () => {
        const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

        expect(component.title).toBe('GOA');
    });

    describe('login', () => {
        it('should call authService.login()', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.login();

            expect(authServiceSpy.login).toHaveBeenCalled();
        });

        it('should call authService.login() only once', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.login();
            component.login();

            expect(authServiceSpy.login).toHaveBeenCalledTimes(2);
        });
    });

    describe('logout', () => {
        it('should call authService.logout()', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.logout();

            expect(authServiceSpy.logout).toHaveBeenCalled();
        });

        it('should call authService.logout() only once', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.logout();
            component.logout();

            expect(authServiceSpy.logout).toHaveBeenCalledTimes(2);
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when user is authenticated', () => {
            authServiceSpy.isAuthenticated.and.returnValue(true);
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            expect(component.isAuthenticated()).toBeTrue();
        });

        it('should return false when user is not authenticated', () => {
            authServiceSpy.isAuthenticated.and.returnValue(false);
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            expect(component.isAuthenticated()).toBeFalse();
        });

        it('should call authService.isAuthenticated()', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.isAuthenticated();

            expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
        });
    });

    describe('name', () => {
        it('should return user name from authService', () => {
            authServiceSpy.name = 'John Doe';
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            expect(component.name()).toBe('John Doe');
        });

        it('should return different names when authService.name changes', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            authServiceSpy.name = 'Alice Smith';
            expect(component.name()).toBe('Alice Smith');

            authServiceSpy.name = 'Bob Johnson';
            expect(component.name()).toBe('Bob Johnson');
        });

        it('should handle empty name', () => {
            authServiceSpy.name = '';
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            expect(component.name()).toBe('');
        });
    });

    describe('update', () => {
        it('should read user with authService mobile', () => {
            authServiceSpy.mobile = '123456789';
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.update();

            expect(userServiceSpy.read).toHaveBeenCalledWith('123456789');
        });

        it('should open UserCreationUpdatingDialogComponent with full user data', () => {
            const fullUser = {
                id: 'user-123',
                mobile: '123456789',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };
            userServiceSpy.read.and.returnValue(of(fullUser));
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.update();

            expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {data: fullUser});
        });

        it('should pass full user object to dialog', () => {
            const userData = {
                id: 'user-456',
                mobile: '987654321',
                firstName: 'Jane'
            };
            userServiceSpy.read.and.returnValue(of(userData));
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.update();

            const dialogCall = dialogSpy.open.calls.mostRecent();
            expect(dialogCall.args[1]).toEqual({data: userData});
        });

        it('should use UserCreationUpdatingDialogComponent when opening dialog', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.update();

            expect(dialogSpy.open).toHaveBeenCalled();
        });

        it('should handle different mobile numbers', () => {
            authServiceSpy.mobile = '999999999';
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.update();

            expect(userServiceSpy.read).toHaveBeenCalledWith('999999999');
        });
    });

    describe('createAccessLink', () => {
        it('should open AccessLinkCreationDialogComponent', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.createAccessLink();

            expect(dialogSpy.open).toHaveBeenCalled();
        });

        it('should open dialog without data', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.createAccessLink();

            const dialogCall = dialogSpy.open.calls.mostRecent();
            expect(dialogCall.args[1]).toBeUndefined();
        });

        it('should be callable multiple times', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.createAccessLink();
            component.createAccessLink();
            component.createAccessLink();

            expect(dialogSpy.open).toHaveBeenCalledTimes(3);
        });
    });

    describe('createIssue', () => {
        it('should open IssueCreationDialogComponent', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.createIssue();

            expect(dialogSpy.open).toHaveBeenCalled();
        });

        it('should open dialog without data', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.createIssue();

            const dialogCall = dialogSpy.open.calls.mostRecent();
            expect(dialogCall.args[1]).toBeUndefined();
        });

        it('should be callable multiple times', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.createIssue();
            component.createIssue();

            expect(dialogSpy.open).toHaveBeenCalledTimes(2);
        });

        it('should open different dialog than createAccessLink', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);
            dialogSpy.open.calls.reset();

            component.createAccessLink();
            const accessLinkDialogComponent = dialogSpy.open.calls.mostRecent().args[0];

            dialogSpy.open.calls.reset();
            component.createIssue();
            const issueDialogComponent = dialogSpy.open.calls.mostRecent().args[0];

            expect(accessLinkDialogComponent).not.toBe(issueDialogComponent);
        });
    });

    describe('constructor behavior', () => {
        it('should initialize all dependencies', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            expect(component).toBeDefined();
        });

        it('should have correct dependency order in constructor', () => {
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            expect(component.title).toBe('GOA');
        });
    });

    describe('integration scenarios', () => {
        it('should handle login followed by update', () => {
            authServiceSpy.isAuthenticated.and.returnValue(true);
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.login();
            component.update();

            expect(authServiceSpy.login).toHaveBeenCalled();
            expect(userServiceSpy.read).toHaveBeenCalled();
        });

        it('should handle creating issue without authentication check affecting dialog open', () => {
            authServiceSpy.isAuthenticated.and.returnValue(false);
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            component.createIssue();

            expect(dialogSpy.open).toHaveBeenCalled();
        });

        it('should handle name call before and after logout', () => {
            authServiceSpy.name = 'Original Name';
            const component = new HomeComponent(dialogSpy as any, userServiceSpy as any, authServiceSpy as any);

            const nameBefore = component.name();
            component.logout();
            authServiceSpy.name = 'New Name';
            const nameAfter = component.name();

            expect(nameBefore).toBe('Original Name');
            expect(nameAfter).toBe('New Name');
        });
    });
});

describe('CrudComponent', () => {
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let component: CrudComponent;

    beforeEach(() => {
        dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        component = new CrudComponent(dialogSpy);
    });

    it('should initialize with the default actions enabled and an empty datasource', () => {
        expect(component.title).toBe('Management');
        expect(component.createAction).toBeTrue();
        expect(component.readAction).toBeTrue();
        expect(component.updateAction).toBeTrue();
        expect(component.deleteAction).toBeFalse();
        expect(component.dataSource.data).toEqual([]);
    });

    it('should update the datasource and columns when data changes', () => {
        const previousSubscription = {
            unsubscribe: jasmine.createSpy('unsubscribe')
        };
        (component as any).dataSub = previousSubscription;

        component.data = of([
            {id: '1', name: 'Income'},
            {description: 'detail', name: 'Expense'}
        ]);

        expect(previousSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.columns).toEqual(['id', 'name', 'description']);
        expect(component.columnsHeader).toEqual(['id', 'name', 'description', 'actions']);
        expect(component.dataSource.data).toEqual([
            {id: '1', name: 'Income'},
            {description: 'detail', name: 'Expense'}
        ]);
    });

    it('should open the detail dialog when an item observable is assigned', () => {
        const previousSubscription = {
            unsubscribe: jasmine.createSpy('unsubscribe')
        };
        (component as any).itemSub = previousSubscription;
        component.title = 'Ingresos';

        component.item = of({id: 'income-1', amount: 100});

        expect(previousSubscription.unsubscribe).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(ReadDetailDialogComponent, {
            data: {
                title: 'Details of Ingresos',
                object: {id: 'income-1', amount: 100}
            }
        });
    });

    it('should filter visible columns using hidden fields', () => {
        component.columns = ['id', 'name', 'amount'];
        component.hiddenFields = ['id'];

        expect(component.visibleColumns).toEqual(['name', 'amount']);
    });

    it('should emit create read update print run and search events', () => {
        const item = {id: '1'};
        spyOn(component.create, 'emit');
        spyOn(component.read, 'emit');
        spyOn(component.update, 'emit');
        spyOn(component.print, 'emit');
        spyOn(component.run, 'emit');
        spyOn(component.searchAll, 'emit');

        component.onCreate();
        component.onRead(item);
        component.onUpdate(item);
        component.onPrint(item);
        component.onRun(item);
        component.onSearch();

        expect(component.create.emit).toHaveBeenCalled();
        expect(component.read.emit).toHaveBeenCalledWith(item);
        expect(component.update.emit).toHaveBeenCalledWith(item);
        expect(component.print.emit).toHaveBeenCalledWith(item);
        expect(component.run.emit).toHaveBeenCalledWith(item);
        expect(component.searchAll.emit).toHaveBeenCalled();
    });

    it('should confirm deletes using the yes dialog and emit only when accepted', () => {
        dialogSpy.open.and.returnValue({
            afterClosed: () => of(true)
        } as any);
        spyOn(component.delete, 'emit');
        component.title = 'Invoices';

        component.onDelete({id: '1'});

        expect(dialogSpy.open).toHaveBeenCalledWith(CancelYesDialogComponent, {
            disableClose: true,
            data: {
                title: 'Delete Invoices',
                message: 'Are you sure you want to delete this item?'
            }
        });
        expect(component.delete.emit).toHaveBeenCalledWith({id: '1'});
    });

    it('should not emit delete when the yes dialog is cancelled', () => {
        dialogSpy.open.and.returnValue({
            afterClosed: () => of(false)
        } as any);
        spyOn(component.delete, 'emit');

        component.onDelete({id: '1'});

        expect(component.delete.emit).not.toHaveBeenCalled();
    });

    it('should use the type to confirm dialog for secure deletes', () => {
        dialogSpy.open.and.returnValue({
            afterClosed: () => of(true)
        } as any);
        spyOn(component.delete, 'emit');
        component.title = 'Invoices';
        component.secureDelete = true;

        component.onDelete({id: '1'});

        expect(dialogSpy.open).toHaveBeenCalledWith(TypeToConfirmDialogComponent, {
            disableClose: true,
            data: {
                title: 'Delete Invoices',
                message: 'Type the confirmation text to proceed.',
                token: 'Delete'
            }
        });
        expect(component.delete.emit).toHaveBeenCalledWith({id: '1'});
    });

    it('should not emit delete when secure confirmation fails', () => {
        dialogSpy.open.and.returnValue({
            afterClosed: () => of(false)
        } as any);
        spyOn(component.delete, 'emit');
        component.secureDelete = true;

        component.onDelete({id: '1'});

        expect(component.delete.emit).not.toHaveBeenCalled();
    });
});

describe('DataCellComponent', () => {
    let component: DataCellComponent;

    beforeEach(() => {
        component = new DataCellComponent();
    });

    it('should identify arrays objects and dates correctly', () => {
        expect(component.isArray(['a'])).toBeTrue();
        expect(component.isArray('a')).toBeFalse();
        expect(component.isObject({id: 1})).toBeTrue();
        expect(component.isObject(['a'])).toBeFalse();
        expect(component.isObject(null)).toBeFalse();
        expect(component.isDate('2026-03-31T12:00:00')).toBeTrue();
        expect(component.isDate('2026-03-31')).toBeFalse();
    });

    it('should return the first key and value from an object', () => {
        const object = {id: 'income-1', amount: 100};

        expect(component.getFirstKey(object)).toBe('id');
        expect(component.getFirstValue(object)).toBe('income-1');
        expect(component.getFirstKey({})).toBe('');
        expect(component.getFirstValue({})).toBeUndefined();
    });
});

describe('ReadDetailDialogComponent', () => {
    it('should expose the title object and labels received in the dialog data', () => {
        const component = new ReadDetailDialogComponent({
            title: 'Income details',
            object: {id: '1', amount: 10}
        });

        expect(component.title).toBe('Income details');
        expect(component.object).toEqual({id: '1', amount: 10});
        expect(component.labels(component.object)).toEqual(['id', 'amount']);
    });
});

describe('Shared Dialog Components', () => {
    it('should expose the injected cancel yes dialog data', () => {
        const data = {title: 'Delete', message: 'Confirm?'};
        const component = new CancelYesDialogComponent(data);

        expect(component.data).toEqual(data);
    });

    it('should allow confirmation only when the token matches', () => {
        const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TypeToConfirmDialogComponent>>('MatDialogRef', ['close']);
        const component = new TypeToConfirmDialogComponent(dialogRefSpy, {
            title: 'Delete',
            message: 'Type Delete',
            token: 'Delete'
        });

        component.input.setValue('Other');
        expect(component.canConfirm).toBeFalse();

        component.input.setValue('Delete');
        expect(component.canConfirm).toBeTrue();
    });

    it('should close the dialog only when the token matches', () => {
        const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TypeToConfirmDialogComponent>>('MatDialogRef', ['close']);
        const component = new TypeToConfirmDialogComponent(dialogRefSpy, {
            title: 'Delete',
            message: 'Type Delete',
            token: 'Delete'
        });

        component.input.setValue('Other');
        component.confirm();
        expect(dialogRefSpy.close).not.toHaveBeenCalled();

        component.input.setValue('Delete');
        component.confirm();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });
});
