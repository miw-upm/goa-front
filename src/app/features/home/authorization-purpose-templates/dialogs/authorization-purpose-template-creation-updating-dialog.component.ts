import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
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

import {FormTextareaComponent} from '@shared/ui/inputs/forms/form-textarea.component';
import {AuthorizationPurposeTemplateService} from '../authorization-purpose-template.service';
import {AuthorizationPurposeTemplate} from '../models/authorization-purpose-template.model';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIcon,
        FormTextareaComponent,
        MatDialogContent
    ],
    templateUrl: 'authorization-purpose-template-creation-updating-dialog.component.html'
})
export class AuthorizationPurposeTemplateCreationUpdatingDialogComponent {
    template: AuthorizationPurposeTemplate;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: AuthorizationPurposeTemplate,
                private readonly service: AuthorizationPurposeTemplateService,
                private readonly dialogRef: MatDialogRef<AuthorizationPurposeTemplateCreationUpdatingDialogComponent>) {
        this.title = data ? 'Edicion de Proposito de Autorizacion' : 'Creacion de Proposito de Autorizacion';
        this.template = data || {id: undefined, purpose: undefined};
    }

    create(): void {
        this.service
            .create(this.template)
            .subscribe(() => this.dialogRef.close());
    }

    update(): void {
        this.service
            .update(this.template.id, this.template)
            .subscribe(() => this.dialogRef.close());
    }

    isCreate(): boolean {
        return this.template.id === undefined;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }
}
