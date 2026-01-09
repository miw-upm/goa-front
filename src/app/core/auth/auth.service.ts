import {Injectable} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";

import {Role} from '@core/auth/models/role.model';

@Injectable({providedIn: 'root'})
export class AuthService {
    authenticated: boolean = false;
    name: string = null;
    mobile: string = null;
    roles: string = null;

    constructor(private readonly oidc: OidcSecurityService) {
    }

    login(): void {
        this.oidc.authorize();
    }

    logout(): void {
        this.oidc.logoff().subscribe(() => {
            this.name = null;
            this.mobile = null;
            this.roles = null;
        });
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    hasRoles(roles: Role[]): boolean {
        if (!this.isAuthenticated() || !this.roles) return false;
        return roles.includes(Role[this.roles.toUpperCase() as keyof typeof Role]);
    }

    isAdmin(): boolean {
        return this.hasRoles([Role.ADMIN]);
    }

    untilManager(): boolean {
        return this.hasRoles([Role.ADMIN, Role.MANAGER]);
    }

    untilOperator(): boolean {
        return this.hasRoles([Role.ADMIN, Role.MANAGER, Role.OPERATOR]);
    }

    isCustomer(): boolean {
        return this.hasRoles([Role.CUSTOMER]);
    }

    allowedRoles(): Role[] {
        if (this.isAdmin()) {
            return [Role.ADMIN, Role.MANAGER, Role.OPERATOR, Role.CUSTOMER];
        }
        if (this.hasRoles([Role.MANAGER])) {
            return [Role.MANAGER, Role.OPERATOR, Role.CUSTOMER];
        }
        if (this.hasRoles([Role.OPERATOR])) {
            return [Role.CUSTOMER];
        }
        return [];
    }

    getMobile(): string {
        return this.mobile;
    }

    getName(): string {
        return this.name
    }

}
