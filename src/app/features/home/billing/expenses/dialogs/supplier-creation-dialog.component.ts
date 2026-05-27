import {Component} from '@angular/core';
import {NgModel} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';

import {FormFieldComponent} from '@shared/ui/inputs/forms/form-field.component';
import {SupplierInfo} from '../models/supplier-info.model';

@Component({
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIcon,
        FormFieldComponent,
    ],
    templateUrl: 'supplier-creation-dialog.component.html'
})
export class SupplierCreationDialogComponent {
    supplier: SupplierInfo = {
        name: '',
        identity: ''
    };

    constructor(private readonly dialogRef: MatDialogRef<SupplierCreationDialogComponent>) {
    }

    create(): void {
        if (!this.canCreate()) {
            return;
        }
        this.dialogRef.close({
            name: this.supplier.name.trim(),
            identity: this.supplier.identity.trim()
        });
    }

    canCreate(): boolean {
        return !!this.supplier.name.trim() && !!this.supplier.identity.trim();
    }

    formInvalid(...controls: NgModel[]): boolean {
        return controls.some(control => control.invalid && (control.dirty || control.touched));
    }
}
