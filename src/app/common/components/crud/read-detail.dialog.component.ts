import {Component, Inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {Observable} from 'rxjs';

import {UppercaseWordsPipe} from '../../pipes/uppercase-words.pipe';
import {DataCellComponent} from "@common/components/crud/data-cell.component";

@Component({
    standalone: true,
    imports: [MatDialogContent, MatLabel, UppercaseWordsPipe, MatDialogActions, MatDialogClose, MatButton,
        NgIf, MatDialogTitle, DataCellComponent, DataCellComponent, DataCellComponent],
    templateUrl: 'read-detail.dialog.component.html',
    styleUrls: ['read-detail-dialog.component.css']
})

export class ReadDetailDialogComponent {
    title: string;
    object: Observable<any>;

    constructor(@Inject(MAT_DIALOG_DATA) data: any) {
        this.title = data.title;
        this.object = data.object;
    }

    labels(object): string[] {
        return Object.getOwnPropertyNames(object);
    }
}
