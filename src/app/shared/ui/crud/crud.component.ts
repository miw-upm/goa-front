import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatDialog} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";

import {DataCellComponent} from "@shared/ui/crud/data-cell.component";
import {ReadDetailDialogComponent} from "@shared/ui/crud/read-detail.dialog.component";
import {UppercaseWordsPipe} from '@shared/pipes/uppercase-words.pipe';
import {CancelYesDialogComponent} from "@shared/ui/dialogs/cancel-yes-dialog.component";
import {TypeToConfirmDialogComponent} from "@shared/ui/dialogs/type-to-confirm-dialog.component";

@Component({
    standalone: true,
    selector: 'app-crud',
    templateUrl: 'crud.component.html',
    styleUrls: ['crud.component.css'],
    imports: [
        MatFormFieldModule,
        MatCardModule,
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatButtonModule,

        UppercaseWordsPipe,
        DataCellComponent
    ],
})
export class CrudComponent {
    @Input() title = 'Management';

    @Input() createAction = true;
    @Input() readAction = true;
    @Input() updateAction = true;
    @Input() deleteAction = false;
    @Input() secureDelete = false;
    @Input() printAction = false;
    @Input() runAction = false;

    @Input() hiddenFields: string[] = [];

    @Output() create = new EventEmitter<any>();
    @Output() read = new EventEmitter<any>();
    @Output() update = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();
    @Output() print = new EventEmitter<any>();
    @Output() run = new EventEmitter<any>();
    @Output() searchAll = new EventEmitter<any>();

    dataSource = new MatTableDataSource<any>([]);
    columns: string[] = [];
    columnsHeader: string[] = [];

    private dataSub?: Subscription;
    private itemSub?: Subscription;

    constructor(private readonly dialog: MatDialog) {
    }

    @Input()
    set data(data$: Observable<any[]>) {
        this.dataSub?.unsubscribe();
        this.dataSub = data$.subscribe(data => {
            const uniqueKeys = new Set<string>();
            data.forEach(row => Object.keys(row).forEach(key => uniqueKeys.add(key)));
            this.columns = Array.from(uniqueKeys);
            this.columnsHeader = [...this.columns, 'actions'];
            this.dataSource = new MatTableDataSource<any>(data);
        });
    }

    @Input()
    set item(item$: Observable<any>) {
        this.itemSub?.unsubscribe();
        this.itemSub = item$.subscribe(data => {
            this.dialog.open(ReadDetailDialogComponent, {
                data: {
                    title: `Details of ${this.title}`,
                    object: data
                }
            });
        });
    }

    get visibleColumns(): string[] {
        return this.columns.filter(col => !this.hiddenFields.includes(col));
    }

    onCreate(): void {
        this.create.emit();
    }

    onRead(item: any): void {
        this.read.emit(item);
    }

    onUpdate(item: any): void {
        this.update.emit(item);
    }

    onDelete(item: any): void {
        if (!this.secureDelete) {
            const ref = this.dialog.open(CancelYesDialogComponent, {
                disableClose: true,
                data: {
                    title: `Delete ${this.title}`,
                    message: 'Are you sure you want to delete this item?'
                }
            });

            ref.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed === true) {
                    this.delete.emit(item);
                }
            });
        } else {
            this.dialog.open(TypeToConfirmDialogComponent, {
                disableClose: true,
                data: {
                    title: `Delete ${this.title}`,
                    message: 'Type the confirmation text to proceed.',
                    token: 'Delete'
                }
            }).afterClosed()
                .subscribe((ok: boolean) => {
                    if (ok === true) this.delete.emit(item);
                });
        }
    }

    onPrint(item: any): void {
        this.print.emit(item);
    }

    onRun(item: any): void {
        this.run.emit(item);
    }

    onSearch() {
        this.searchAll.emit();
    }
}
