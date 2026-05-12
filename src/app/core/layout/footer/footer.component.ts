import {Component, ViewEncapsulation} from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';

import {environment} from '@env';

@Component({
    standalone: true,
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [MatDividerModule, MatGridListModule, MatListModule, MatIconModule]
})
export class FooterComponent {
    readonly hosting = `${environment.HOSTING}`;
    readonly host = `${environment.NAME}`;
    readonly version = `${environment.VERSION}`;
    readonly backEndUser = environment.REST_USER;
    readonly backEndEngagement = environment.REST_ENGAGEMENT;
    readonly backEndSupport = environment.REST_SUPPORT;
}
