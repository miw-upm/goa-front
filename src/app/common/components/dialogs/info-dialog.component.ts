import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ClipboardComponent} from "@common/components/inputs/forms/clipboard.component";

export type InfoDialogData = {
    title?: string;
    message?: string;
};

@Component({
    standalone: true,
    templateUrl: 'info-dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    imports: [
        MatDialogTitle,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatIconModule,
        ClipboardComponent
    ]
})
export class InfoDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: InfoDialogData) {
    }

}
