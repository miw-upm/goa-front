import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filters/filter-input.component';
import {TitleComponent} from '@shared/ui/title/title.component';
import {CancelYesDialogComponent} from '@shared/ui/dialogs/cancel-yes-dialog.component';
import {ClipboardToastDialogComponent} from '@shared/ui/dialogs/clipboard-toast-dialog.component';
import {AuthService} from '@core/auth/auth.service';

import {AdministrativeAuthorizationService} from '../administrative-authorization.service';
import {AdministrativeAuthorizationFindCriteria} from '../models/administrative-authorization-find-criteria.model';
import {AdministrativeAuthorization} from '../models/administrative-authorization.model';
import {ADMINISTRATIVE_AUTHORIZATIONS_COLUMNS} from './administrative-authorizations-columns.config';
import {
    AdministrativeAuthorizationCreationUpdatingDialogComponent
} from '../dialogs/administrative-authorization-creation-updating-dialog.component';

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent, TitleComponent],
    templateUrl: 'administrative-authorizations.component.html'
})
export class AdministrativeAuthorizationsComponent {
    title = 'Autorizaciones Administrativas';
    administrativeAuthorizations: Observable<AdministrativeAuthorization[]> = of([]);
    administrativeAuthorization: Observable<AdministrativeAuthorization>;
    columns = ADMINISTRATIVE_AUTHORIZATIONS_COLUMNS;

    deleteVisibility = false;
    criteria: AdministrativeAuthorizationFindCriteria = {};

    constructor(private readonly dialog: MatDialog,
                private readonly service: AdministrativeAuthorizationService,
                auth: AuthService) {
        this.deleteVisibility = auth.isAdmin();
    }

    search(): void {
        this.administrativeAuthorizations = this.service.search(this.criteria);
    }

    create(): void {
        this.dialog
            .open(AdministrativeAuthorizationCreationUpdatingDialogComponent)
            .afterClosed()
            .subscribe((customer: string | undefined) => {
                if (customer) {
                    this.criteria.client = customer;
                    this.search();
                }
            });
    }

    update(authorization: AdministrativeAuthorization): void {
        this.service.read(authorization.id).subscribe(fullAuthorization =>
            this.dialog
                .open(AdministrativeAuthorizationCreationUpdatingDialogComponent, {
                    data: fullAuthorization
                })
                .afterClosed()
                .subscribe((customer: string | undefined) => {
                    if (customer) {
                        this.criteria.client = customer;
                        this.search();
                    }
                })
        );
    }

    delete(authorization: AdministrativeAuthorization): void {
        this.dialog.open(CancelYesDialogComponent, {
            data: {
                title: 'Opción peligrosa!!!',
                message: '¿Estás seguro de eliminar esta Autorización Administrativa?'
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                this.service.delete(authorization.id).subscribe(() => this.search());
            }
        });
    }

    read(authorization: AdministrativeAuthorization): void {
        this.administrativeAuthorization = this.service.read(authorization.id);
    }

    print(authorization: AdministrativeAuthorization): void {
        this.service.print(authorization.id).subscribe();
    }

    link(authorization: AdministrativeAuthorization): void {
        this.service.createAccessLink(authorization)
            .subscribe(link => this.copyAndNotify(link));
    }

    private copyAndNotify(link: string): void {
        navigator.clipboard.writeText(link);
        this.dialog.open(ClipboardToastDialogComponent, {
            data: 'Enlace copiado al portapapeles'
        });
    }
}
