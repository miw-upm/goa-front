import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CrudComponent} from "@common/components/crud/crud.component";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AccessLinkService} from "../access-link.service";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent],
    templateUrl: 'access-link.component.html'
})
export class AccessLinkComponent {
    title = 'Access Links';
    accessLinks = of([]);
    accessLink: Observable<any>;

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

    read(accessLink: any): void {
        this.accessLink = this.accessLinkService.read(accessLink.id);
    }

}
