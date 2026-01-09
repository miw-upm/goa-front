import {Routes} from '@angular/router';
import {routes as authRoutes} from './features/auth/auth.routes';
import {routes as homeRoutes} from './features/home/home.routes';
import {routes as customerRoutes} from './features/customer/customer.routes';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},

    ...authRoutes,
    ...homeRoutes,
    ...customerRoutes,

    // opcional: 404
    // { path: '**', redirectTo: 'home' }
];