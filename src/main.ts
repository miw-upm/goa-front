import {bootstrapApplication} from '@angular/platform-browser';
import {importProvidersFrom, provideZoneChangeDetection} from "@angular/core";
import {provideRouter} from "@angular/router";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor, AuthModule, LogLevel} from "angular-auth-oidc-client";
import {AppComponent} from './app/app.component';
import {routes} from "./app/app.routes";
import { environment } from '@env';


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
                    authority: environment.REST_USER,
                    redirectUrl: environment.FRONT_END + '/callback',
                    postLogoutRedirectUri: environment.FRONT_END,
                    clientId: 'spaClientId_YIIUZGjrEjUWa82rWiK',
                    scope: 'openid profile offline_access',
                    responseType: 'code',
                    silentRenew: true,
                    useRefreshToken: true,
                    secureRoutes: [environment.FRONT_END],
                    logLevel: LogLevel.Debug,
                }
            })
        )
    ]
}).catch((err) => console.error(err));
