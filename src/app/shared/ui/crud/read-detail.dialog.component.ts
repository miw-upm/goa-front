import {Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

import {UppercaseWordsPipe} from '@shared/pipes/uppercase-words.pipe';
import {DataCellComponent} from '@shared/ui/crud/data-cell.component';

@Component({
    standalone: true,
    templateUrl: 'read-detail.dialog.component.html',
    styleUrls: ['read-detail-dialog.component.css'],
    imports: [MatDialogContent, MatDialogActions, MatDialogTitle, MatDialogClose, MatButtonModule, UppercaseWordsPipe,
        DataCellComponent
    ]
})

export class ReadDetailDialogComponent {
    title: string;
    object!: any;

    constructor(@Inject(MAT_DIALOG_DATA) data: any) {
        this.title = data.title;
        this.object = data.object;
    }

    labels(object: any): string[] {
        return Object.getOwnPropertyNames(object);
    }
}
