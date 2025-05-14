import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';


import {AuthService} from "@core/services/auth.service";
import {FooterComponent} from '@common/components/footer.component';

@Component({
    standalone: true,
    imports: [CommonModule, FooterComponent, MatToolbar, MatIcon, MatButton, RouterLink, MatMenuTrigger,
        MatMenu, MatMenuItem, NgOptimizedImage, RouterOutlet],
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    title = 'TPV';

    constructor(private readonly dialog: MatDialog, private readonly authService: AuthService) {
    }

    login(): void {
        this.authService.login();
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
}
