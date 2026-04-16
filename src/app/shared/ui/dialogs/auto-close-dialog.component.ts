import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

@Component({
    standalone: true,
    templateUrl: 'auto-close-dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    imports: [
        MatDialogTitle,
        MatIconModule,
    ]
})
export class AutoCloseDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public message: string,
        private dialogRef: MatDialogRef<AutoCloseDialogComponent>
    ) {
    }

    ngOnInit(): void {
        setTimeout(() => this.dialogRef.close(), 1500);
    }
}