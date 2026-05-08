import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';

import {AuthService} from "@core/auth/auth.service";
import {Role} from "@core/auth/models/role.model";
import {FooterComponent} from '@core/layout/footer/footer.component';
import {UserService} from "../users/user.service";
import {UserCreationUpdatingDialogComponent} from "../users/dialogs/user-creation-updating-dialog.component";

@Component({
    standalone: true,
    providers: [],
    imports: [
        CommonModule,
        RouterLink,
        RouterOutlet,
        NgOptimizedImage,
        FooterComponent,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule
    ],
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],

})
export class HomeComponent {
    title = 'GOA';

    constructor(private readonly dialog: MatDialog, private readonly userService: UserService,
                private readonly authService: AuthService) {
    }

    login(): void {
        this.authService.login();
    }

    update() {
        this.userService.read(this.authService.mobile)
            .subscribe(fullUser => this.dialog.open(UserCreationUpdatingDialogComponent, {data: fullUser}));

    }

    logout(): void {
        this.authService.logout();
    }

    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    isCustomer(): boolean {
        return this.authService.isCustomer();
    }

    name() {
        return this.authService.name;
    }

}
