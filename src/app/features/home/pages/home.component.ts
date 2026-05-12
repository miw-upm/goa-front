import {Component, ViewEncapsulation} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

import {AuthService} from "@core/auth/auth.service";
import {FooterComponent} from '@core/layout/footer/footer.component';
import {UserService} from "../users/user.service";
import {UserCreationUpdatingDialogComponent} from "../users/dialogs/user-creation-updating-dialog.component";

@Component({
    standalone: true,
    providers: [],
    imports: [
        RouterLink,
        RouterOutlet,
        NgOptimizedImage,
        FooterComponent,
        MatToolbar,
        MatIcon,
        MatButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger
    ],
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
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

    name() {
        return this.authService.name;
    }

    initials(): string {
        const n = this.authService.name || '';
        const raw = n.substring(0, 3);
        return raw.charAt(0).toUpperCase() + raw.substring(1).toLowerCase();
    }

}
