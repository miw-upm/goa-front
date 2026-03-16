import {AsyncPipe} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

import {FormFieldComponent} from '@shared/ui/inputs/forms/field.component';
import {IssueCreationRequest, IssueType} from '../issue.model';
import {IssueService} from '../issue.service';

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormFieldComponent
    ],
    templateUrl: 'issue-creation-dialog.component.html',
    styleUrls: ['issue-creation-dialog.component.css']
})
export class IssueCreationDialogComponent {
    title = 'Crear incidencia';
    isSubmitting = false;
    apiErrorMessage: string | undefined;

    issue: IssueCreationRequest = {
        title: undefined,
        description: undefined,
        technicalContext: undefined,
        type: IssueType.BUG
    };

    issueTypes = of(Object.values(IssueType));

    constructor(private readonly issueService: IssueService, private readonly dialog: MatDialog) {
    }

    create(): void {
        if (this.isSubmitDisabled()) {
            return;
        }

        this.isSubmitting = true;
        this.apiErrorMessage = undefined;

        this.issueService
            .create(this.issue)
            .subscribe({
                next: () => {
                    this.dialog.closeAll();
                },
                error: (errorResponse) => {
                    this.apiErrorMessage = this.extractErrorMessage(errorResponse);
                    this.isSubmitting = false;
                }
            });
    }

    isSubmitDisabled(): boolean {
        return this.isSubmitting ||
            !this.hasText(this.issue.title) ||
            !this.hasText(this.issue.description) ||
            !this.hasText(this.issue.technicalContext) ||
            !this.issue.type;
    }

    private hasText(value: string | undefined): boolean {
        return !!value && value.trim().length > 0;
    }

    private extractErrorMessage(errorResponse: any): string {
        if (!errorResponse) {
            return 'Error inesperado al crear la incidencia.';
        }

        if (typeof errorResponse === 'string') {
            return errorResponse;
        }

        if (errorResponse.message && errorResponse.error) {
            return `${errorResponse.error}: ${errorResponse.message}`;
        }

        if (errorResponse.message) {
            return errorResponse.message;
        }

        if (errorResponse.error?.message) {
            return errorResponse.error.message;
        }

        return 'No se pudo procesar la respuesta del servidor.';
    }
}
