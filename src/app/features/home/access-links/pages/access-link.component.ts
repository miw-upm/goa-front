import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

import {CrudComponent} from "@shared/ui/crud/crud.component";
import {AccessLinkService} from "../access-link.service";
import {AccessLink} from "@features/shared/models/acces-link.model";
import {AuthService} from "@core/auth/auth.service";
import {ClipboardToastDialogComponent} from "@shared/ui/dialogs/clipboard-toast-dialog.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AccessLinkSearch} from "./access-link-search.model";
import {FilterInputComponent} from "@shared/ui/inputs/filter-input.component";
import {CancelYesDialogComponent} from "@shared/ui/dialogs/cancel-yes-dialog.component";

@Component({
    standalone: true,
    providers: [AccessLinkService],
    imports: [FormsModule, CrudComponent, MatSlideToggle, FilterInputComponent],
    templateUrl: 'access-link.component.html'
})
export class AccessLinkComponent {
    visible: boolean = true;
    title = 'Access Links';
    criteria: AccessLinkSearch;

    accessLinks: Observable<AccessLink[]> = of([]);
    accessLink: Observable<any>;

    constructor(private readonly dialog: MatDialog, private readonly accessLinkService: AccessLinkService, private readonly auth: AuthService) {
        this.visible = auth.isAdmin();
        this.resetSearch();
    }

    resetSearch(): void {
        this.criteria = {expired: false, mobile: undefined, scope: undefined};
    }

    search(): void {
        this.accessLinks = this.accessLinkService.search(this.criteria);
    }

    delete(accessLink: AccessLink) {
        if (accessLink.lastUsedForUpdateAt) {
            this.dialog.open(CancelYesDialogComponent, {
                data: {
                    title: 'Confirmar eliminación',
                    message: 'Este enlace está en uso. ¿Desea eliminarlo?'
                }
            }).afterClosed().subscribe(result => {
                if (result) {
                    this.accessLinkService.delete(accessLink.id).subscribe(
                        () => this.search()
                    );
                }
            });
        } else {
            this.accessLinkService.delete(accessLink.id).subscribe(
                () => this.search()
            );
        }
    }

    read(accessLink: AccessLink): void {
        this.accessLink = this.accessLinkService.read(accessLink.id);
    }

    viewLink(accessLink: AccessLink): void {
        this.dialog.open(ClipboardToastDialogComponent, {
            data: {
                message: 'Enlace público copiado al portapapeles',
                clipboard: this.accessLinkService.buildAccessUrl(accessLink)
            }
        });
    }

}
