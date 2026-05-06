import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {Observable, of} from "rxjs";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from "@angular/material/select";

import {AuthService} from '@core/auth/auth.service';
import {FormSelectComponent} from '@shared/ui/inputs/forms/form-select.component';
import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {AppDateFieldComponent} from '@shared/ui/inputs/forms/data.component';
import {SharedUserService} from '@features/shared/services/shared-user.service';
import {User} from '@features/shared/models/user.model';
import {UserService} from '../user.service';
import {FormNifComponent} from "@shared/ui/inputs/forms/form-nif.component";

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
        FormNifComponent,
    ],
    templateUrl: 'user-creation-updating-dialog.component.html',
    styleUrls: ['user-dialog.component.css']
})

export class UserCreationUpdatingDialogComponent {
    user: User;
    title: string;
    roles: Observable<string[]>;
    oldMobile: string;
    enablePasswordChange: boolean;
    provinces: Observable<string[]>;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: User,
        private readonly userService: UserService,
        private readonly sharedUserService: SharedUserService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<UserCreationUpdatingDialogComponent, string>
    ) {
        this.title = data ? 'Actualización de Usuarios' : 'Creación de Usuarios';
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
            .subscribe(() => this.dialogRef.close(this.user.mobile));
    }

    update(): void {
        if (!this.enablePasswordChange) {
            this.user.password = null;
        }
        this.userService
            .update(this.user.id, this.user)
            .subscribe(() => this.dialogRef.close(this.user.mobile));
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }
}
