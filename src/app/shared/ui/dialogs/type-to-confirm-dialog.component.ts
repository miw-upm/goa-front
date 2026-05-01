import {Component, Inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

export type TypeToConfirmDialogData = {
    title?: string;
    message?: string;
    expectedText?: string;
};

const DEFAULT_DIALOG_DATA: Required<TypeToConfirmDialogData> = {
    title: 'Confirmar Acción',
    message: 'Escribe el texto indicado para continuar',
    expectedText: 'CONFIRMAR'
};

@Component({
    standalone: true,
    templateUrl: './type-to-confirm-dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    imports: [
        MatDialogTitle,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ]
})
export class TypeToConfirmDialogComponent {
    input = new FormControl('', {nonNullable: true, validators: [Validators.required]});

    constructor(
        private readonly ref: MatDialogRef<TypeToConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TypeToConfirmDialogData
    ) {
        this.data = {
            ...DEFAULT_DIALOG_DATA,
            ...(data ?? {})
        };
    }

    get canConfirm(): boolean {
        return this.input.value === this.data.expectedText;
    }

    confirm(): void {
        if (this.canConfirm) this.ref.close(true);
    }
}
