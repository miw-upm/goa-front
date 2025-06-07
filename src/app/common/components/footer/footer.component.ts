import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';

import {environment} from '@env';

@Component({
    standalone: true,
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    imports: [NgOptimizedImage, MatDividerModule, MatGridListModule, MatListModule, MatIconModule]
})
export class FooterComponent {
    version: string;
    backEndUser: string;

    constructor() {
        this.version = environment.NAME + ':' + environment.VERSION;
        this.backEndUser = environment.REST_USER;
    }

}
