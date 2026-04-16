import {bootstrapApplication} from '@angular/platform-browser';
import {importProvidersFrom, LOCALE_ID, provideZoneChangeDetection} from "@angular/core";
import {provideRouter} from "@angular/router";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor, AuthModule, LogLevel} from "angular-auth-oidc-client";
import {AppComponent} from './app/app.component';
import {environment} from '@env';
import {provideAnimations} from "@angular/platform-browser/animations";
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {FormsModule} from "@angular/forms";
import {routes} from "./app/app.routes";
import {registerLocaleData} from "@angular/common";
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(FormsModule),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideAnimations(),
        importProvidersFrom(MatNativeDateModule),
        {provide: MAT_DATE_LOCALE, useValue: 'es'},
        {provide: LOCALE_ID, useValue: 'es'},
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClient(withInterceptors([authInterceptor()])),
        importProvidersFrom(
            AuthModule.forRoot({
                config: {
                    authority: environment.REST_USER,
                    redirectUrl: environment.FRONT_END + '/callback',
                    postLogoutRedirectUri: environment.FRONT_END,
                    clientId: 'spaClientId',
                    scope: 'openid profile offline_access',
                    responseType: 'code',
                    silentRenew: false,
                    useRefreshToken: true,
                    secureRoutes: environment.SECURE_ROUTES,
                    logLevel: LogLevel.Debug,
                }
            })
        )
    ]
}).catch((err) => console.error(err));
