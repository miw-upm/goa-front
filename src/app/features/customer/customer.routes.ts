import {Routes} from '@angular/router';
import {CustomerEditProfileComponent} from "./edit-profile/pages/customer-edit-profile.component";
import {SignerDocumentComponent} from "./accept-engagement-letter/pages/signer-document.component";
import {
    DownloadEngagementLetterBudgetComponent
} from "./download-engagement-letter-budget/pages/download-engagement-letter-budget.component";

export const routes: Routes = [
    {
        path: 'customer/edit-profile/:mobile/:token',
        component: CustomerEditProfileComponent
    },
    {
        path: 'customer/sign-engagement-letter/:mobile/:token',
        component: SignerDocumentComponent
    },
    {
        path: 'customer/read-engagement-letter/:mobile/:token',
        component: DownloadEngagementLetterBudgetComponent
    },
];