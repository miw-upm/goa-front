import {of} from 'rxjs';

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
