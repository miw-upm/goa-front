import {Component, Inject} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {SharedLegalTaskService} from '@features/shared/services/shared-legal-task.service';
import {LegalTask} from '@features/shared/models/legal-task.model';
import {LegalTaskService} from '../legal-task.service';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        MatDialogTitle,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIcon,
        FormFieldComponent,
        MatDialogContent
    ],
    templateUrl: 'legal-task-creation-updating-dialog.component.html'
})

export class LegalTaskCreationUpdatingDialogComponent {
    task: LegalTask;
    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) data: LegalTask, private readonly legalTaskService: LegalTaskService,
                private readonly sharedLegalTaskService: SharedLegalTaskService, private readonly dialog: MatDialog) {
        this.title = data ? 'Actualización de Tarea Legal' : 'Creación de Tarea Legal';
        this.task = data || {id: undefined, title: undefined};
    }

    create(): void {
        this.sharedLegalTaskService
            .create(this.task)
            .subscribe(() => this.dialog.closeAll());
    }

    update(): void {
        this.legalTaskService
            .update(this.task.id, this.task)
            .subscribe(() => this.dialog.closeAll());
    }

    isCreate(): boolean {
        return this.task.id === undefined;
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(ctrl => ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

}
