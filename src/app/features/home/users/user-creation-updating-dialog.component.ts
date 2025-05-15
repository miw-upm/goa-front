import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatButton} from '@angular/material/button';

import {UserService} from './user.service';
import {User} from './user.model';
import {MatOption, MatSelect} from "@angular/material/select";
import {AuthService} from "@core/services/auth.service";

@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput, MatSlideToggle,
        MatDialogActions, MatDialogClose, MatButton, NgIf, MatSelect, MatSelect, MatOption, NgForOf, DatePipe],
    templateUrl: 'user-creation-updating-dialog.component.html',
    styleUrls: ['user-dialog.component.css']
})

export class UserCreationUpdatingDialogComponent {
    user: User;
    title: string;
    documentTypes: string[];
    roles: string[];
    oldMobile: string;
    enablePasswordChange: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) data: User, private readonly userService: UserService,
                private readonly authService: AuthService, private readonly dialog: MatDialog) {
        this.title = data ? 'Update User' : 'Create User';
        this.user = data || {mobile: undefined, firstName: undefined, active: true};
        this.oldMobile = data ? data.mobile : undefined;
        this.enablePasswordChange = false;
        this.userService.findDocumentTypes().subscribe(types => this.documentTypes = types);
        this.roles = this.authService.allowedRoles();
    }

    isCreate(): boolean {
        return this.oldMobile === undefined;
    }

    create(): void {
        this.userService
            .create(this.user)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        if (!this.enablePasswordChange) {
            this.user.password = null;
        }
        this.userService
            .update(this.oldMobile, this.user)
            .subscribe(() => this.dialog.closeAll());
    }


    invalid(): boolean {
        return this.check(this.user.mobile) || this.check(this.user.firstName);
    }

    check(attr: string): boolean {
        return attr === undefined || null || attr === '';
    }
}
