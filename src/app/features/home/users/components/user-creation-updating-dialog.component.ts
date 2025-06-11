import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
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
import {Observable, of} from "rxjs";
import {FormSelectComponent} from "@common/components/inputs/forms/select.component";
import {FormFieldComponent} from "@common/components/inputs/forms/field.component";
import {AppDateFieldComponent} from "@common/components/inputs/forms/data.component";
import {SharedUserService} from "@shared/services/shared-user.service";

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
        FormSelectComponent,
        FormFieldComponent,
        AppDateFieldComponent,
    ],
    templateUrl: 'user-creation-updating-dialog.component.html',
    styleUrls: ['user-dialog.component.css']
})

export class UserCreationUpdatingDialogComponent {
    user: User;
    title: string;
    userDocumentTypes = of(Object.values(UserDocumentType));
    roles: Observable<string[]>;
    oldMobile: string;
    enablePasswordChange: boolean;
    provinces: Observable<string[]>;

    constructor(@Inject(MAT_DIALOG_DATA) data: User, private readonly userService: UserService,
                private readonly sharedUserService: SharedUserService,
                private readonly authService: AuthService, private readonly dialog: MatDialog) {
        this.title = data ? 'Update User' : 'Create User';
        this.user = data || {mobile: undefined, firstName: undefined, active: true};
        this.oldMobile = data ? data.mobile : undefined;
        this.enablePasswordChange = false;
        this.roles = of(this.authService.allowedRoles());
        this.provinces = this.sharedUserService.findProvinces();
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

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }
}
