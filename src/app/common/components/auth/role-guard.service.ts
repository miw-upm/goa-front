import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';

import {AuthService} from '@common/components/auth/auth.service';
import {Role} from '@common/components/auth/models/role.model';

@Injectable({providedIn: 'root'})
export class RoleGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const roles: Role[] = route.data['roles'];
        if (this.auth.hasRoles(roles)) {
            return true;
        } else {
            this.router.navigate(['']).then();
            return false;
        }
    }

}
