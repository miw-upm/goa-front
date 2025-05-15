import {Injectable} from '@angular/core';
import {Role} from '@core/models/role.model';
import {OidcSecurityService} from "angular-auth-oidc-client";

@Injectable({providedIn: 'root'})
export class AuthService {
    authenticated: boolean = false;
    name: string = null;
    mobile: number = 0;
    roles: string = null;

    constructor(private readonly oidcSecurityService: OidcSecurityService) {
    }

    login(): void {
        this.oidcSecurityService.authorize();
    }

    logout(): void {
        this.oidcSecurityService.logoff().subscribe(() => {
            this.name = null;
            this.mobile = 0;
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

    getMobile(): number {
        return this.mobile;
    }

    getName(): string {
        return this.name
    }

}
