import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

import {CrudComponent} from "@shared/ui/crud/crud.component";
import {CopyDialogComponent} from "@shared/ui/dialogs/copy-dialog.component";
import {AccessLinkService} from "../access-link.service";
import {AccessLink} from "@features/shared/models/acces-link.model";
import {AuthService} from "@core/auth/auth.service";
import {AutoCloseDialogComponent} from "@shared/ui/dialogs/auto-close-dialog.component";

@Component({
    standalone: true,
    providers: [AccessLinkService],
    imports: [FormsModule, CrudComponent],
    templateUrl: 'access-link.component.html'
})
export class AccessLinkComponent {
    visible: boolean = true;
    title = 'Access Links';

    accessLinks: Observable<AccessLink[]> = of([]);
    accessLink: Observable<any>;

    constructor(private readonly dialog: MatDialog, private readonly accessLinkService: AccessLinkService, private readonly auth:AuthService) {
        this.visible = auth.isAdmin();
    }

    search(): void {
        this.accessLinks = this.accessLinkService.search();
    }

    delete(accessLink: AccessLink) {
        this.accessLinkService.delete(accessLink.id).subscribe(
            () => this.search()
        )

    }

    read(accessLink: AccessLink): void {
        this.accessLink = this.accessLinkService.read(accessLink.id);
    }

    viewLink(accessLink: AccessLink): void {
        navigator.clipboard.writeText(this.accessLinkService.buildAccessUrl(accessLink));
        this.dialog.open(AutoCloseDialogComponent, {
            data: 'Link de acceso copiado'
        });
    }

}
