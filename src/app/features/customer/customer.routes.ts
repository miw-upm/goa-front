import {Routes} from '@angular/router';
import {CustomerEditProfileComponent} from "./pages/customer-edit-profile.component";

export const routes: Routes = [
    {path: 'customer/edit-profile/:mobile/:token', component: CustomerEditProfileComponent},
];