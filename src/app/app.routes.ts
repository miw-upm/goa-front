import {Routes} from '@angular/router';
import {routes as authRoutes} from './features/auth/auth.routes';
import {routes as homeRoutes} from './features/home/home.routes';
import {routes as customerRoutes} from './features/customer/customer.routes';
import {routes as publicRoutes} from './features/public/public.routes';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},

    ...authRoutes,
    ...homeRoutes,
    ...customerRoutes,
    ...publicRoutes,

    // opcional: 404
    // { path: '**', redirectTo: 'home' }
];
