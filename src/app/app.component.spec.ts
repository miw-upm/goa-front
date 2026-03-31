import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {OidcSecurityService} from 'angular-auth-oidc-client';

import {Role} from '@core/auth/models/role.model';
import {AuthService} from '@core/auth/auth.service';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

});

describe('AuthService', () => {
    let oidcSpy: jasmine.SpyObj<OidcSecurityService>;
    let service: AuthService;

    beforeEach(() => {
        oidcSpy = jasmine.createSpyObj<OidcSecurityService>('OidcSecurityService', ['authorize', 'logoff']);
        oidcSpy.logoff.and.returnValue(of(void 0) as any);
        service = new AuthService(oidcSpy);
    });

    it('should initialize with unauthenticated and empty user data', () => {
        expect(service.authenticated).toBeFalse();
        expect(service.name).toBeNull();
        expect(service.mobile).toBeNull();
        expect(service.roles).toBeNull();
    });

    it('should delegate login to the oidc client', () => {
        service.login();

        expect(oidcSpy.authorize).toHaveBeenCalled();
    });

    it('should clear user data on logout', () => {
        service.name = 'Ana';
        service.mobile = '600000000';
        service.roles = 'admin';

        service.logout();

        expect(oidcSpy.logoff).toHaveBeenCalled();
        expect(service.name).toBeNull();
        expect(service.mobile).toBeNull();
        expect(service.roles).toBeNull();
    });

    it('should return authentication state', () => {
        service.authenticated = true;

        expect(service.isAuthenticated()).toBeTrue();
    });

    it('should reject roles when user is not authenticated or has no roles', () => {
        service.authenticated = false;
        service.roles = 'manager';
        expect(service.hasRoles([Role.MANAGER])).toBeFalse();

        service.authenticated = true;
        service.roles = null;
        expect(service.hasRoles([Role.MANAGER])).toBeFalse();
    });

    it('should resolve role checks using the stored role text', () => {
        service.authenticated = true;
        service.roles = 'manager';

        expect(service.hasRoles([Role.MANAGER])).toBeTrue();
        expect(service.isAdmin()).toBeFalse();
        expect(service.untilManager()).toBeTrue();
        expect(service.untilOperator()).toBeTrue();
        expect(service.isCustomer()).toBeFalse();
    });

    it('should expose allowed roles for admins', () => {
        service.authenticated = true;
        service.roles = 'admin';

        expect(service.isAdmin()).toBeTrue();
        expect(service.allowedRoles()).toEqual([Role.ADMIN, Role.MANAGER, Role.OPERATOR, Role.CUSTOMER]);
    });

    it('should expose allowed roles for managers', () => {
        service.authenticated = true;
        service.roles = 'manager';

        expect(service.allowedRoles()).toEqual([Role.MANAGER, Role.OPERATOR, Role.CUSTOMER]);
    });

    it('should expose allowed roles for operators and empty for the rest', () => {
        service.authenticated = true;
        service.roles = 'operator';
        expect(service.allowedRoles()).toEqual([Role.CUSTOMER]);

        service.roles = 'customer';
        expect(service.isCustomer()).toBeTrue();
        expect(service.allowedRoles()).toEqual([]);
    });

    it('should return stored mobile and name', () => {
        service.mobile = '611111111';
        service.name = 'Rosa';

        expect(service.getMobile()).toBe('611111111');
        expect(service.getName()).toBe('Rosa');
    });
});
