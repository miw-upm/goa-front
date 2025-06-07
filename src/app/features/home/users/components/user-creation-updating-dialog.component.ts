import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from "@angular/material/select";

import {AuthService} from "@common/components/auth/auth.service";
import {UserDocumentType} from "@shared/models/UserDocumentType";
import {User} from "@shared/models/user.model";
import {UserService} from '../user.service';
import {DatePipe} from "@angular/common";

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatSelectModule,
        DatePipe
    ],
    templateUrl: 'user-creation-updating-dialog.component.html',
    styleUrls: ['user-dialog.component.css']
})

export class UserCreationUpdatingDialogComponent {
    user: User;
    title: string;
    documentTypes: string[] = Object.values(UserDocumentType);
    roles: string[];
    oldMobile: string;
    enablePasswordChange: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) data: User, private readonly userService: UserService,
                private readonly authService: AuthService, private readonly dialog: MatDialog) {
        this.title = data ? 'Update User' : 'Create User';
        this.user = data || {mobile: undefined, firstName: undefined, active: true};
        this.oldMobile = data ? data.mobile : undefined;
        this.enablePasswordChange = false;
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
