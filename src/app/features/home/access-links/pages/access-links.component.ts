import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

import {CrudComponent} from "@shared/ui/crud/crud.component";
import {AccessLinkService} from "../access-link.service";
import {AccessLink} from "@features/shared/models/access-link.model";
import {AuthService} from "@core/auth/auth.service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AccessLinkFindCriteria} from "../access-link-find-criteria.model";
import {FilterInputComponent} from "@shared/ui/inputs/filter-input.component";
import {TypeToConfirmDialogComponent} from "@shared/ui/dialogs/type-to-confirm-dialog.component";
import {TitleComponent} from "@shared/ui/title/title.component";

@Component({
    standalone: true,
    providers: [AccessLinkService],
    imports: [FormsModule, CrudComponent, MatSlideToggle, FilterInputComponent, TitleComponent],
    templateUrl: 'access-links.component.html'
})
export class AccessLinksComponent {
    visible: boolean = true;
    title = 'Access Links';
    criteria: AccessLinkFindCriteria;

    accessLinks: Observable<AccessLink[]> = of([]);
    accessLink: Observable<any>;

    constructor(private readonly dialog: MatDialog, private readonly accessLinkService: AccessLinkService, auth: AuthService) {
        this.visible = auth.isAdmin();
        this.resetSearch();
    }

    resetSearch(): void {
        this.criteria = {expired: false, client: undefined, scope: undefined};
    }

    search(): void {
        this.accessLinks = this.accessLinkService.search(this.criteria);
    }

    delete(accessLink: AccessLink) {
        if (accessLink.lastUsedAt) {
            this.dialog.open(TypeToConfirmDialogComponent, {
                data: {
                    title: 'Confirmar eliminación',
                    message: 'Este enlace ya ha sido usado. ¿Está seguro que desea eliminarlo?',
                    expectedText: 'ELIMINAR'
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

}
