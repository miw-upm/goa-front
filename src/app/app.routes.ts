import {Routes} from "@angular/router";

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '',
        loadChildren: () =>
            import('./features/app-shell/app-shell.routes')
                .then(m => m.routes)
    }
];