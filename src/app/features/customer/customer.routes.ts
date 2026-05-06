import {Routes} from '@angular/router';
import {CustomerEditProfileComponent} from "./pages/customer-edit-profile.component";
import {ComplaintFormComponent} from "./complaints/complaint-form/complaint-form.component";

export const routes: Routes = [
    {path: 'customer/edit-profile/:mobile/:token', component: CustomerEditProfileComponent},
    {path: 'new-complaint', component: ComplaintFormComponent},
];