import {Routes} from '@angular/router';
import {PublicEngagementLetterAccessComponent} from './engagement-letter/pages/public-engagement-letter-access.component';
import {PublicEngagementLetterService} from './engagement-letter/public-engagement-letter.service';

export const routes: Routes = [
    {
        path: 'public/engagement-letters/access',
        component: PublicEngagementLetterAccessComponent,
        providers: [PublicEngagementLetterService],
    },
];
