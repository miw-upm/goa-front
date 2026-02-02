import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

import {CrudComponent} from "@shared/ui/crud/crud.component";
import {InfoDialogComponent} from "@shared/ui/dialogs/info-dialog.component";
import {AccessLinkService} from "../access-link.service";
import {AccessLink} from "../acces-link.model";

@Component({
    standalone: true,
    providers: [AccessLinkService],
    imports: [FormsModule, CrudComponent],
    templateUrl: 'access-link.component.html'
})
export class AccessLinkComponent {
    title = 'Access Links';
    accessLinks: Observable<AccessLink[]> = of([]);
    accessLink: Observable<any>;

    constructor(private readonly dialog: MatDialog, private readonly accessLinkService: AccessLinkService) {
    }

    search(): void {
        this.accessLinks = this.accessLinkService.search();
    }

    delete(accessLink: any) {
        this.accessLinkService.delete(accessLink.id).subscribe(
            () => this.search()
        )

    }

    read(accessLink: any): void {
        this.accessLink = this.accessLinkService.read(accessLink.id);
    }

    run(accessLink: any): void {
        const link = this.accessLinkService.createLink(accessLink);
        this.dialog.open(InfoDialogComponent, {
            width: '1200px',
            data: {
                title: 'Access link',
                message: link
            }
        });
    }

}
