import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

import {UserService} from '../users/user.service';
import {AccessLink} from "./acces-link.model";
import {SearchByUserComponent} from "../../shared/search-by-user.component";
import {AccessLinkService} from "./access-link.service";

@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput,
        MatDialogActions, MatDialogClose, MatButton, SearchByUserComponent],
    templateUrl: 'access-link-creation-dialog.component.html',
    styleUrls: ['access-link-creation-dialog.component.css']
})

export class AccessLinkCreationDialogComponent {
    accessLink: AccessLink;

    constructor(private readonly accessLinkService: AccessLinkService,
                private readonly dialog: MatDialog) {
        this.accessLink = {mobile: null, scope: "EDIT_PROFILE", value: null}
    }

    create(): void {
        this.accessLinkService
            .createAccessLink(this.accessLink)
            .subscribe(accessLink => this.accessLink.value = accessLink.value);
    }


    invalid(): boolean {
        return this.check(this.accessLink.mobile) || this.check(this.accessLink.scope);
    }

    check(attr: string): boolean {
        return attr === undefined || null || attr === '';
    }

}
