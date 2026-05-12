import {Component, Inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

import {UppercaseWordsPipe} from '@shared/pipes/uppercase-words.pipe';
import {CrudColumnConfig} from './crud-column.config';
import {DataCellComponent} from './data-cell.component';

@Component({
    standalone: true,
    templateUrl: 'read-detail-dialog.component.html',
    imports: [
        MatDialogContent, MatDialogActions, MatDialogTitle, MatDialogClose, MatButtonModule,
        UppercaseWordsPipe, DataCellComponent
    ]
})
export class ReadDetailDialogComponent {
    title: string;
    object!: any;
    columns: CrudColumnConfig[];

    constructor(@Inject(MAT_DIALOG_DATA) data: any) {
        this.title = data.title;
        this.object = data.object;
        this.columns = data.columns ?? [];
    }

    get useConfig(): boolean {
        return this.columns.length > 0;
    }

    /** Modo legacy: todas las propiedades del objeto */
    labels(object: any): string[] {
        return Object.getOwnPropertyNames(object);
    }

    /** Label para una propiedad: busca en columns config, si no usa el nombre raw */
    getLabelFor(key: string): string {
        const col = this.columns.find(c => c.key === key || c.fieldsTitle?.includes(key) || c.fields?.includes(key));
        return col ? col.label : key;
    }
}
