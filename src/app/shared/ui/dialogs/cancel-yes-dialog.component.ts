import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

export type CancelYesDialogData = {
    title?: string;
    message?: string;
};

@Component({
    standalone: true,
    templateUrl: 'cancel-yes-dialog.component.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule
    ]
})
export class CancelYesDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: CancelYesDialogData) {
    }
}
