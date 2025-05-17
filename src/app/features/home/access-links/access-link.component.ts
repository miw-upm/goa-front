import {Component} from "@angular/core";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {CrudComponent} from "@common/components/crud.component";
import {MatButton} from "@angular/material/button";
import {of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AccessLinkService} from "./access-link.service";

@Component({
    standalone: true,
    imports: [MatCard, MatCardContent, FormsModule, MatIcon, CrudComponent, MatCardTitle,
        MatButton],
    templateUrl: 'access-link.component.html'
})
export class AccessLinkComponent {
    title = 'Access Links management';
    accessLinks = of([]);

    constructor(private readonly dialog: MatDialog, private readonly accessLinkService: AccessLinkService) {
    }

    search(): void {
        this.accessLinks = this.accessLinkService.search();
    }

    delete(accessLink) {
        this.accessLinkService.delete(accessLink.id).subscribe(
            () => this.search()
        )

    }
}
