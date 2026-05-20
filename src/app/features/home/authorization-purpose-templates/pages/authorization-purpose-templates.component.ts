import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {AuthService} from '@core/auth/auth.service';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filters/filter-input.component';
import {TitleComponent} from '@shared/ui/title/title.component';
import {AuthorizationPurposeTemplateService} from '../authorization-purpose-template.service';
import {
    AuthorizationPurposeTemplateCreationUpdatingDialogComponent
} from '../dialogs/authorization-purpose-template-creation-updating-dialog.component';
import {AuthorizationPurposeTemplate} from '../models/authorization-purpose-template.model';
import {AUTHORIZATION_PURPOSE_TEMPLATES_COLUMNS} from './authorization-purpose-templates-columns.config';

@Component({
    standalone: true,
    imports: [FormsModule, FilterInputComponent, TitleComponent, CrudComponent],
    templateUrl: 'authorization-purpose-templates.component.html'
})
export class AuthorizationPurposeTemplatesComponent {
    deleteVisibility: boolean = false;
    searchProposito: string;
    templates = of([]);
    template: Observable<AuthorizationPurposeTemplate>;
    columns = AUTHORIZATION_PURPOSE_TEMPLATES_COLUMNS;

    constructor(private readonly dialog: MatDialog, private readonly service: AuthorizationPurposeTemplateService,
                auth: AuthService) {
        this.deleteVisibility = auth.isAdmin();
        this.resetSearch();
    }

    search(): void {
        this.templates = this.service.search(this.searchProposito);
    }

    resetSearch(): void {
        this.searchProposito = undefined;
    }

    create(): void {
        this.dialog
            .open(AuthorizationPurposeTemplateCreationUpdatingDialogComponent)
            .afterClosed()
            .subscribe(() => this.search());
    }

    update(template: AuthorizationPurposeTemplate): void {
        this.dialog
            .open(AuthorizationPurposeTemplateCreationUpdatingDialogComponent, {data: template})
            .afterClosed()
            .subscribe(() => this.search());
    }

    delete(template: AuthorizationPurposeTemplate): void {
        this.service.delete(template.id).subscribe(() => this.search());
    }

    read(template: AuthorizationPurposeTemplate): void {
        this.template = this.service.read(template.id);
    }
}
