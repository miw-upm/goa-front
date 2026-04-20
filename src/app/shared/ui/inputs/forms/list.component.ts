import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from "@angular/material/dialog";
import {CancelYesDialogComponent} from "@shared/ui/dialogs/cancel-yes-dialog.component";

@Component({
    standalone: true,
    selector: 'app-form-list',
    imports: [DragDropModule, MatButtonModule, MatIconModule],
    template: `
        <div cdkDropList class="example-list" (cdkDropListDropped)="onDrop($event)">
            @for (item of items; track $index; let i = $index) {
                <div class="example-box" cdkDrag>
                    <button mat-icon-button (click)="removeItem(i)" aria-label="Eliminar elemento">
                        <mat-icon>delete</mat-icon>
                    </button>
                    @if (actionIcon) {
                        <button mat-icon-button (click)="onAction(item)" class="mat-button-mini">
                            <mat-icon>{{ actionIcon }}</mat-icon>
                        </button>
                    }
                    @if (!keyView?.length) {
                        {{ item }}
                    } @else {
                        @for (key of keyView; track $index; let last = $last) {
                            {{ item[key] }}@if (!last) {, }
                        }
                    }
                </div>
            }
        </div>
    `
})
export class FormListComponent {
    @Input() items: any[] = [];
    @Input() title = 'List';
    @Input() keyView: string[];
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

    onAction(item: any): void {
        this.action.emit(item);
    }
}