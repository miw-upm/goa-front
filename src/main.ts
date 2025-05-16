import {bootstrapApplication} from '@angular/platform-browser';
import {importProvidersFrom, provideZoneChangeDetection} from "@angular/core";
import {provideRouter} from "@angular/router";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor, AuthModule, LogLevel} from "angular-auth-oidc-client";
import {AppComponent} from './app/app.component';
import {routes} from "./app/app.routes";

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideAnimationsAsync(),
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClient(withInterceptors([authInterceptor()])),
        importProvidersFrom(
            AuthModule.forRoot({
                config: {
                    authority: 'http://localhost:8080/goa-user',
                    redirectUrl: 'http://localhost:4200/callback',
                    postLogoutRedirectUri: 'http://localhost:4200',
                    clientId: 'spa-client-id',
                    scope: 'openid profile offline_access',
                    responseType: 'code',
                    silentRenew: true,
                    useRefreshToken: true,
                    secureRoutes: ['http://localhost:8080'],
                    logLevel: LogLevel.Debug,
                }
            })
        )
    ]
}).catch((err) => console.error(err));
