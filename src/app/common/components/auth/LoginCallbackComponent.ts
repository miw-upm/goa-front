import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {OidcSecurityService} from "angular-auth-oidc-client";

import {AuthService} from "@common/components/auth/auth.service";

@Component({
    selector: 'app-login-callback',
    template: `<p>Autenticando...</p>`,
})
export class LoginCallbackComponent implements OnInit {
    constructor(private readonly oidcSecurityService: OidcSecurityService,
                private readonly authService: AuthService,
                private readonly router: Router) {
    }

    ngOnInit(): void {
        this.oidcSecurityService.checkAuth().subscribe(({isAuthenticated}) => {
            this.authService.authenticated = isAuthenticated;
            if (isAuthenticated) {
                this.oidcSecurityService.getPayloadFromAccessToken().subscribe(
                    data => {
                        this.authService.name = data['name'];
                        this.authService.mobile = data['sub'];
                        this.authService.roles = data['roles'];
                    },
                );
            }
        });
    }

}