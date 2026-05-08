import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from "@angular/material/dialog";
import {CancelYesDialogComponent} from "@shared/ui/dialogs/cancel-yes-dialog.component";
import {TypeToConfirmDialogComponent} from "@shared/ui/dialogs/type-to-confirm-dialog.component";

@Component({
    standalone: true,
    selector: 'app-form-list',
    imports: [CdkDropList, CdkDrag, CdkDragHandle, MatIconButton, MatIcon],
    template: `
        <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="form-list">
            @for (item of items; track $index; let i = $index) {
                <div class="form-list-item" cdkDrag>
                    <mat-icon class="form-list-drag" cdkDragHandle>drag_indicator</mat-icon>
                    <span class="form-list-text">
                        @if (!keyView.length) {
                            {{ item }}
                        } @else {
                            @for (key of keyView; track $index; let last = $last) {
                                {{ item[key] }}@if (!last) {
                                    ,
                                }
                            }
                        }
                    </span>
                    <span class="form-list-actions">
                        @if (actionIcon) {
                            <button mat-icon-button (click)="onAction(item)" aria-label="Editar">
                                <mat-icon>{{ actionIcon }}</mat-icon>
                            </button>
                        }
                        <button mat-icon-button (click)="removeItem(i)" aria-label="Eliminar">
                            <mat-icon>close</mat-icon>
                        </button>
                    </span>
                </div>
            }
        </div>
    `,
    styles: [`
        .form-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .form-list-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 8px 6px 4px;
            border: 1px solid var(--mat-sys-outline-variant);
            border-radius: 12px;
            background: var(--mat-sys-surface-container-lowest);
            transition: box-shadow 0.2s;
        }

        .form-list-item:hover {
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        .form-list-drag {
            color: #9e9e9e;
            cursor: grab;
            font-size: 20px;
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        .form-list-text {
            flex: 1;
            font-size: 0.875rem;
            color: var(--mat-sys-on-surface);
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .form-list-actions {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            gap: 0;
        }

        .form-list-actions .mat-mdc-icon-button {
            color: #9e9e9e;
            --mdc-icon-button-state-layer-size: 32px;
            --mdc-icon-button-icon-size: 18px;
            width: 32px;
            height: 32px;
            padding: 0;
        }

        .cdk-drag-preview {
            border: 1px solid var(--mat-sys-outline-variant);
            border-radius: 12px;
            background: var(--mat-sys-surface-container-lowest);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 8px 6px 4px;
        }

        .cdk-drag-placeholder {
            opacity: 0.3;
        }
    `]
})
export class FormListComponent {
    @Input() items: any[] = [];
    @Input() title = 'List';
    @Input() secure = false;
    @Input() keyView: string[] = [];
    @Input() actionIcon: string;
    @Output() itemsChange = new EventEmitter<any[]>();
    @Output() action = new EventEmitter<any>();

    constructor(private readonly dialog: MatDialog) {
    }

    onDrop(event: CdkDragDrop<any[]>): void {
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
        this.itemsChange.emit(this.items);
    }

    removeItem(index: number): void {
        if (this.secure) {
            this.dialog.open(TypeToConfirmDialogComponent, {
                data: {
                    title: 'Eliminar peligroso',
                    message: 'Eliminar las firmas no tendrán forma de recuperarse, ¿Estás seguro?',
                    expectedText: "Estoy Seguro"
                }
            }).afterClosed().subscribe(result => {
                if (result) {
                    this.items.splice(index, 1);
                    this.itemsChange.emit([...this.items]);
                }
            });
        } else {
            this.dialog.open(CancelYesDialogComponent, {
                data: {
                    title: 'Eliminar elemento',
                    message: '¿Estás seguro de eliminar este elemento?'
                }
            }).afterClosed().subscribe(result => {
                if (result) {
                    this.items.splice(index, 1);
                    this.itemsChange.emit([...this.items]);
                }
            });
        }
    }

    onAction(item: any): void {
        this.action.emit(item);
    }
}