import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

export type WaitingDialogData = {
    title?: string;
    message?: string;
};

@Component({
    standalone: true,
    templateUrl: 'waiting-dialog.component.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatProgressSpinnerModule,
    ]
})
export class WaitingDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: WaitingDialogData) {
    }
}
