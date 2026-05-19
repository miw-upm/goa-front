import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

import {FormCustomerComponent} from '@shared/ui/inputs/forms/form-customer.component';
import {SearchByUserComponent} from '@features/shared/ui/search-by-user.component';
import {User} from '@features/shared/models/user.model';
import {AdministrativeAuthorizationService} from '../administrative-authorization.service';
import {AdministrativeAuthorization} from '../models/administrative-authorization.model';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIcon,
        MatFormField,
        MatLabel,
        MatInput,
        FormCustomerComponent,
        SearchByUserComponent,
    ],
    templateUrl: 'administrative-authorization-creation-updating-dialog.component.html'
})
export class AdministrativeAuthorizationCreationUpdatingDialogComponent {
    authorization: AdministrativeAuthorization;
    title: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: AdministrativeAuthorization,
        private readonly service: AdministrativeAuthorizationService,
        private readonly dialogRef: MatDialogRef<AdministrativeAuthorizationCreationUpdatingDialogComponent, string>
    ) {
        this.title = data ? 'Edición de Autorización Administrativa' : 'Creación de Autorización Administrativa';
        this.authorization = data ? {...data,
            authorizingCustomers: [...(data.authorizingCustomers ?? [])],
            authorizedRepresentatives: [...(data.authorizedRepresentatives ?? [])],
            signatures: [...(data.signatures ?? [])],
        } : this.createEmpty();
    }

    isCreate(): boolean {
        return !this.authorization.id;
    }

    create(): void {
        this.service.create(this.authorization)
            .subscribe(() => this.dialogRef.close(this.authorization.authorizingCustomers[0]?.firstName));
    }

    update(): void {
        this.service.update(this.authorization.id, this.authorization)
            .subscribe(() => this.dialogRef.close(this.authorization.authorizingCustomers[0]?.firstName));
    }

    invalid(): boolean {
        return !this.authorization.authorizationPurpose?.trim() ||
            !this.authorization.authorizingCustomers?.length ||
            !this.authorization.authorizedRepresentatives?.length;
    }

    addAuthorizingCustomer(user: User): void {
        if (!this.authorization.authorizingCustomers.some(u => u.mobile === user.mobile)) {
            this.authorization.authorizingCustomers.push(user);
        }
    }

    removeAuthorizingCustomer(index: number): void {
        this.authorization.authorizingCustomers.splice(index, 1);
    }

    addAuthorizedRepresentative(user: User): void {
        if (!this.authorization.authorizedRepresentatives.some(u => u.mobile === user.mobile)) {
            this.authorization.authorizedRepresentatives.push(user);
        }
    }

    removeAuthorizedRepresentative(index: number): void {
        this.authorization.authorizedRepresentatives.splice(index, 1);
    }

    private createEmpty(): AdministrativeAuthorization {
        return {
            authorizingCustomers: [],
            authorizedRepresentatives: [],
            authorizationPurpose: '',
            signatures: [],
        };
    }
}
