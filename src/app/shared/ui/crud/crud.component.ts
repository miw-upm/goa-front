import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenuModule} from '@angular/material/menu';

import {DataCellComponent} from '@shared/ui/crud/data-cell.component';
import {ReadDetailDialogComponent} from '@shared/ui/crud/read-detail-dialog.component';
import {UppercaseWordsPipe} from '@shared/pipes/uppercase-words.pipe';
import {CancelYesDialogComponent} from '@shared/ui/dialogs/cancel-yes-dialog.component';
import {TypeToConfirmDialogComponent} from '@shared/ui/dialogs/type-to-confirm-dialog.component';

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
        MatMenuModule,
        UppercaseWordsPipe,
        DataCellComponent
    ],
})
export class CrudComponent {
    @Input() title = 'Management';
    @Input() secureDelete = false;
    @Input() typeToDelete: string = null;

    @Input() createAction = true;
    @Input() readAction = true;
    @Input() updateAction = true;
    @Input() deleteAction = false;
    @Input() searchAction = true;

    @Input() printAction = false;
    @Input() linkAction = false;
    @Input() runAction = false;
    @Input() jsonAction = false

    @Input() cancelAction = false;
    @Input() assistantAction = false;
    @Input() eventsAction = false;
    @Input() timelineAction = false;
    @Input() alertsAction = false;
    @Input() notificationsAction = false;
    @Input() commentsAction = false;


    @Input() deleteInline = false;
    @Input() commentsInline = false;

    @Input() hiddenFields: string[] = [];
    @Input() changeFields: string[] = [];
    @Input() columnOrder: string[] = [];

    @Output() create = new EventEmitter<any>();
    @Output() read = new EventEmitter<any>();
    @Output() update = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();
    @Output() searchAll = new EventEmitter<any>();

    @Output() print = new EventEmitter<any>();
    @Output() link = new EventEmitter<any>();
    @Output() run = new EventEmitter<any>();
    @Output() json = new EventEmitter<any>();

    @Output() cancel = new EventEmitter<any>();
    @Output() assistant = new EventEmitter<any>();
    @Output() events = new EventEmitter<any>();
    @Output() timeline = new EventEmitter<any>();
    @Output() alerts = new EventEmitter<any>();
    @Output() notifications = new EventEmitter<any>();
    @Output() comments = new EventEmitter<any>();


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
    set item(item$: Observable<any> | undefined) {
        this.itemSub?.unsubscribe();
        if (!item$) {
            return;
        }
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
        const hidden = this.hiddenFields;
        if (this.columnOrder.length > 0) {
            // 1. Los columnas en el orden indicado (excluyendo las ocultas)
            const ordered = this.columnOrder.filter(col => !hidden.includes(col) && this.columns.includes(col));
            // 2. Columnas no mencionadas en columnOrder, también visibles, al final
            const rest = this.columns.filter(col => !hidden.includes(col) && !this.columnOrder.includes(col));
            return [...ordered, ...rest];
        }
        return this.columns.filter(col => !hidden.includes(col));
    }

    getChangeFields(column: string): string[] {
        const rule = this.changeFields.find(item => item.startsWith(column + ':'));
        if (!rule) return [];

        const [, fieldsPart] = rule.split(':');
        if (!fieldsPart) return [];

        return fieldsPart
            .split(',')
            .map(x => x.trim())
            .filter(Boolean);
    }

    hasMoreActions(): boolean {
        const deleteInMenu = this.deleteAction && !this.deleteInline;
        const commentsInMenu = this.commentsAction && !this.commentsInline;
        return deleteInMenu || commentsInMenu || this.assistantAction || this.eventsAction ||
            this.timelineAction || this.alertsAction || this.notificationsAction ||
            this.runAction || this.cancelAction;
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
                    message: 'Are you sure you want to delete this item?',
                    expectedText: `Delete`
                }
            });

            ref.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed === true) {
                    this.delete.emit(item);
                }
            });
        } else {
            const confirmationText: string = this.typeToDelete ? item[this.typeToDelete] : 'Delete';
            this.dialog.open(TypeToConfirmDialogComponent, {
                disableClose: true,
                data: {
                    title: `Delete ${this.title}`,
                    message: 'Type the confirmation text to proceed.',
                    expectedText: confirmationText
                }
            }).afterClosed()
                .subscribe((ok: boolean) => {
                    if (ok === true) this.delete.emit(item);
                });
        }
    }

    onSearch() {
        this.searchAll.emit();
    }

    onPrint(item: any): void {
        this.print.emit(item);
    }

    onRun(item: any): void {
        this.run.emit(item);
    }

    onLink(item: any): void {
        this.link.emit(item);
    }

    onJson(): void {
        this.json.emit();
    }


    onAssistant(item: any): void {
        this.assistant.emit(item);
    }

    onEvents(item: any): void {
        this.events.emit(item);
    }

    onAlerts(item: any): void {
        this.alerts.emit(item);
    }

    onNotifications(item: any): void {
        this.notifications.emit(item);
    }

    onComments(item: any): void {
        this.comments.emit(item);
    }

    onTimeline(item: any): void {
        this.timeline.emit(item);
    }

    onCancel(item: any): void {
        this.cancel.emit(item);
    }

}
