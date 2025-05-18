import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {AccessLink} from "./acces-link.model";
import {SearchByUserComponent} from "../../shared/search-by-user.component";
import {AccessLinkService} from "./access-link.service";
import {MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, FormsModule, MatInput,
        MatDialogActions, MatDialogClose, MatButton, SearchByUserComponent, MatCardHeader, MatIconButton, MatIcon, MatTooltip, MatSuffix],
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

    check(attr: string | null | undefined): boolean {
        return !attr || attr.trim() === '';
    }

    copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text).then();
    }
}
