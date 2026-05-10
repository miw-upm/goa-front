import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {TypeToConfirmDialogComponent} from "@shared/ui/dialogs/type-to-confirm-dialog.component";
import {CancelYesDialogComponent} from "@shared/ui/dialogs/cancel-yes-dialog.component";


@Component({
    selector: 'app-form-customer',
    standalone: true,
    imports: [MatIconButton, MatIcon],
    templateUrl: './form-customer.component.html'
})
export class FormCustomerComponent {
    @Input() fullName = '';
    @Input() mobile = '';
    @Input() secure = false;

    @Output() remove = new EventEmitter<void>();

    constructor(private readonly dialog: MatDialog) {
    }

    get initials(): string {
        return this.fullName
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map(part => part[0])
            .join('')
            .toUpperCase();
    }

    removeCustomer(): void {
        const dialogRef = this.secure
            ? this.dialog.open(TypeToConfirmDialogComponent, {
                data: {
                    title: 'Eliminar cliente',
                    message: 'Esta acción no se puede deshacer. ¿Estás seguro?',
                    expectedText: 'Estoy Seguro'
                }
            })
            : this.dialog.open(CancelYesDialogComponent, {
                data: {
                    title: 'Eliminar cliente',
                    message: '¿Estás seguro de eliminar este cliente?'
                }
            });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.remove.emit();
            }
        });
    }
}
