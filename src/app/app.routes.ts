import { Routes } from '@angular/router';
import {LoginCallbackComponent} from "@common/components/LoginCallbackComponent";
import {HomeComponent} from "./features/home/home.component";

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'callback', component: LoginCallbackComponent},
    {
        path: 'home', component: HomeComponent
    },
];
