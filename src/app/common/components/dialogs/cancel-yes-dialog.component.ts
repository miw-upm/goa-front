import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

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
}
