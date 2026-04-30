import {Routes} from '@angular/router';
import {CustomerEditProfileComponent} from "./edit-profile/pages/customer-edit-profile.component";
import {ReadEngagementLetterComponent} from "./engagement-letter/read/pages/read-engagement-letter.component";
import {SignDocumentComponent} from "./engagement-letter/sign/pages/sign-document.component";

export const routes: Routes = [
    {
        path: 'customer/edit-profile/:urlId/:token',
        component: CustomerEditProfileComponent
    },
    {
        path: 'customer/sign-engagement-letter/:urlId/:token',
        component: SignDocumentComponent
    },
    {
        path: 'customer/read-engagement-letter/:urlId/:token',
        component: ReadEngagementLetterComponent
    },
];