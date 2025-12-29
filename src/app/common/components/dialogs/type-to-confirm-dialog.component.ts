import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

export type TypeToConfirmDialogData = {
    title?: string;
    message?: string;
    token: string;
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
    input = new FormControl('', { nonNullable: true, validators: [Validators.required] });

    constructor(
        private readonly ref: MatDialogRef<TypeToConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TypeToConfirmDialogData
    ) {}

    get canConfirm(): boolean {
        return this.input.value === this.data.token;
    }

    confirm(): void {
        if (this.canConfirm) this.ref.close(true);
    }
}
