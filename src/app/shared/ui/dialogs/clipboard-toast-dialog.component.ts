import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';

export type ClipboarToastDialogData = {
    message: string;
    clipboard?: string;
};

@Component({
    standalone: true,
    templateUrl: 'clipboard-toast-dialog.component.html',
    imports: [
        MatDialogTitle,
    ]
})
export class ClipboardToastDialogComponent implements OnInit {
    message: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ClipboarToastDialogData | string,
        private readonly dialogRef: MatDialogRef<ClipboardToastDialogComponent>
    ) {
        this.message = typeof data === 'string' ? data : data.message;
    }

    ngOnInit(): void {
        if (typeof this.data !== 'string' && this.data.clipboard) {
            navigator.clipboard.writeText(this.data.clipboard);
        }
        setTimeout(() => this.dialogRef.close(), 2000);
    }
}
