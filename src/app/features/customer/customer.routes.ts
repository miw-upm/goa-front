import {Routes} from '@angular/router';
import {CustomerComponent} from "./pages/customer.component";

export const routes: Routes = [
    {path: 'customer/edit-profile/:mobile/:token', component: CustomerComponent},
];