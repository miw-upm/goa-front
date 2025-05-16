import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
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
import {MatButton} from '@angular/material/button';

import {UserService} from './user.service';
import {User} from './user.model';
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput, MatDialogActions, MatDialogClose, MatButton, MatSelect, MatSelect, MatOption, NgForOf],
    templateUrl: 'user-basic-updating-dialog.component.html',
    styleUrls: ['user-dialog.component.css']
})

export class UserBasicUpdatingDialogComponent {
    user: User;
    documentTypes: string[];
    oldMobile: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: User, private readonly userService: UserService,
                private readonly dialog: MatDialog) {
        this.user = data;
        this.oldMobile = data.mobile;
        this.userService.findDocumentTypes().subscribe(types => this.documentTypes = types);
    }

    update(): void {
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
