import {Routes} from '@angular/router';
import {CustomerEditProfileComponent} from "./edit-profile/pages/customer-edit-profile.component";
import {SignerDocumentComponent} from "./accept-engagement-letter/pages/signer-document.component";

export const routes: Routes = [
    {
        path: 'customer/edit-profile/:mobile/:token',
        component: CustomerEditProfileComponent
    },
    {
        path: 'customer/accept-engagement-letter/:mobile/:token',
        component: SignerDocumentComponent
    },
];