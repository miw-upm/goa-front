import {inject} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {AuthService} from '@core/auth/auth.service';

export function authInitializer(): () => Promise<void> {
    const oidc = inject(OidcSecurityService);
    const authService = inject(AuthService);

    return (): Promise<void> =>
        oidc.checkAuth().toPromise().then(({isAuthenticated}) => {
            authService.hydrate(isAuthenticated, oidc);
        });
}
