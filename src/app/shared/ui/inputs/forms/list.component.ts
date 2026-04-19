import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

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

    onDrop(event: CdkDragDrop<any[]>): void {
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
        this.itemsChange.emit(this.items);
    }

    removeItem(index: number): void {
        this.items.splice(index, 1);
        this.itemsChange.emit([...this.items]);
    }

    onAction(item: any): void {
        this.action.emit(item);
    }
}