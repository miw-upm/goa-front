import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';

import {CrudColumnConfig} from './crud-column.config';
import {DataCell2Component} from './data-cell2.component';
import {ReadDetailDialogComponent} from '@shared/ui/crud/read-detail-dialog.component';
import {UppercaseWordsPipe} from '@shared/pipes/uppercase-words.pipe';
import {CancelYesDialogComponent} from '@shared/ui/dialogs/cancel-yes-dialog.component';
import {TypeToConfirmDialogComponent} from '@shared/ui/dialogs/type-to-confirm-dialog.component';

@Component({
    standalone: true,
    selector: 'app-crud2',
    templateUrl: 'crud2.component.html',
    imports: [
        MatFormFieldModule,
        MatCardModule,
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        UppercaseWordsPipe,
        DataCell2Component
    ],
})
export class Crud2Component {
    @Input() title = 'Gestión';
    @Input() columns: CrudColumnConfig[] = [];
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
    @Input() jsonAction = false;

    @Input() cancelAction = false;
    @Input() assistantAction = false;
    @Input() eventsAction = false;
    @Input() timelineAction = false;
    @Input() alertsAction = false;
    @Input() notificationsAction = false;
    @Input() commentsAction = false;

    @Input() deleteInline = false;
    @Input() commentsInline = false;

    // Legacy inputs (modo retrocompatible sin columns)
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

    /** Columnas auto-descubiertas (modo legacy) */
    autoColumns: string[] = [];

    private dataSub?: Subscription;
    private itemSub?: Subscription;

    constructor(private readonly dialog: MatDialog) {
    }

    get useConfig(): boolean {
        return this.columns.length > 0;
    }

    /** Claves de columna para mat-table (+ 'actions') */
    get displayedColumns(): string[] {
        if (this.useConfig) {
            return [...this.columns.map(c => c.key), 'actions'];
        }
        return [...this.visibleAutoColumns, 'actions'];
    }

    /** Columnas de datos sin 'actions' */
    get dataColumns(): string[] | CrudColumnConfig[] {
        if (this.useConfig) {
            return this.columns;
        }
        return this.visibleAutoColumns;
    }

    /** Modo legacy: columnas visibles tras filtrar hiddenFields y aplicar columnOrder */
    get visibleAutoColumns(): string[] {
        const hidden = this.hiddenFields;
        if (this.columnOrder.length > 0) {
            const ordered = this.columnOrder.filter(col => !hidden.includes(col) && this.autoColumns.includes(col));
            const rest = this.autoColumns.filter(col => !hidden.includes(col) && !this.columnOrder.includes(col));
            return [...ordered, ...rest];
        }
        return this.autoColumns.filter(col => !hidden.includes(col));
    }

    getColumnConfig(key: string): CrudColumnConfig | undefined {
        return this.columns.find(c => c.key === key);
    }

    getColumnLabel(key: string): string {
        const config = this.getColumnConfig(key);
        return config ? config.label : key;
    }

    getChangeFields(column: string): string[] {
        const rule = this.changeFields.find(item => item.startsWith(column + ':'));
        if (!rule) return [];
        const [, fieldsPart] = rule.split(':');
        if (!fieldsPart) return [];
        return fieldsPart.split(',').map(x => x.trim()).filter(Boolean);
    }

    @Input()
    set data(data$: Observable<any[]>) {
        this.dataSub?.unsubscribe();
        this.dataSub = data$.subscribe(data => {
            if (!this.useConfig) {
                const uniqueKeys = new Set<string>();
                data.forEach(row => Object.keys(row).forEach(key => uniqueKeys.add(key)));
                this.autoColumns = Array.from(uniqueKeys);
            }
            this.dataSource = new MatTableDataSource<any>(data);
        });
    }

    @Input()
    set item(item$: Observable<any> | undefined) {
        this.itemSub?.unsubscribe();
        if (!item$) return;
        this.itemSub = item$.subscribe(data => {
            this.dialog.open(ReadDetailDialogComponent, {
                data: {
                    title: `Detalles de ${this.title}`,
                    object: data
                }
            });
        });
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
                    title: `Eliminar ${this.title}`,
                    message: '¿Estás seguro de que deseas eliminar este elemento?'
                }
            });
            ref.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed === true) {
                    this.delete.emit(item);
                }
            });
        } else {
            const confirmationText: string = this.typeToDelete ? item[this.typeToDelete] : 'ELIMINAR';
            this.dialog.open(TypeToConfirmDialogComponent, {
                disableClose: true,
                data: {
                    title: `Eliminar ${this.title}`,
                    message: 'Escribe el texto de confirmación para continuar.',
                    expectedText: confirmationText
                }
            }).afterClosed().subscribe((ok: boolean) => {
                if (ok === true) this.delete.emit(item);
            });
        }
    }

    onSearch(): void {
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
