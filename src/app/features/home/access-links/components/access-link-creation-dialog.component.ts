import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

import {SearchByUserComponent} from "@shared/components/search-by-user.component";
import {User} from "@shared/models/user.model";
import {AccessLink} from "../acces-link.model";
import {AccessLinkService} from "../access-link.service";

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
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
        SearchByUserComponent
    ],
    templateUrl: 'access-link-creation-dialog.component.html',
    styleUrls: ['access-link-creation-dialog.component.css']
})

export class AccessLinkCreationDialogComponent {
    accessLink: AccessLink;

    constructor(private readonly accessLinkService: AccessLinkService,
                private readonly dialog: MatDialog) {
        this.accessLink = {mobile: null, scope: "EDIT_PROFILE", link: null}
    }

    create(): void {
        this.accessLinkService
            .createAccessLink(this.accessLink)
            .subscribe(accessLink => this.accessLink.link = accessLink.link);
    }


    invalid(): boolean {
        return this.check(this.accessLink.mobile) || this.check(this.accessLink.scope);
    }

    check(attr: string | null | undefined): boolean {
        return !attr || attr.trim() === '';
    }

    copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text).then();
    }

    updateUser(user: User) {
        this.accessLink.mobile = user.mobile;
    }
}
