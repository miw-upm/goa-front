import {Component} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

import {FormFieldComponent} from "@shared/ui/inputs/forms/field.component";
import {ClipboardComponent} from "@shared/ui/inputs/forms/clipboard.component";
import {SearchByUserComponent} from "../../../common/ui/search-by-user.component";
import {User} from "../../../common/models/user.model";
import {AccessLink} from "../acces-link.model";
import {AccessLinkService} from "../access-link.service";

@Component({
    standalone: true,
    providers: [AccessLinkService],
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatFormFieldModule,
        MatCardModule,
        SearchByUserComponent,
        FormFieldComponent,
        ClipboardComponent,
        MatButton
    ],
    templateUrl: 'access-link-creation-dialog.component.html',
    styleUrls: ['access-link-creation-dialog.component.css']
})

export class AccessLinkCreationDialogComponent {
    accessLink: AccessLink;
    link: string

    constructor(private readonly accessLinkService: AccessLinkService) {
        this.accessLink = {mobile: null, scope: "edit-profile"}
    }

    create(): void {
        this.accessLinkService
            .createAccessLink(this.accessLink)
            .subscribe(link => this.link = link);
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    updateUser(user: User) {
        this.accessLink.mobile = user.mobile;
    }
}
