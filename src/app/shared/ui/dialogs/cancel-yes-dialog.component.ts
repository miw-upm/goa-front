import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

export type CancelYesDialogData = {
    title?: string;
    message?: string;
};

@Component({
    standalone: true,
    templateUrl: 'cancel-yes-dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    imports: [
        MatDialogTitle,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatIconModule
    ]
})
export class CancelYesDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: CancelYesDialogData) {
    }
}
