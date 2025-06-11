import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-form-list',
    imports: [CommonModule, DragDropModule, MatButtonModule, MatIconModule],
    template: `
        <div cdkDropList class="example-list" (cdkDropListDropped)="onDrop($event)">
            @for (item of items; track item) {
                <div class="example-box" cdkDrag>
                    <button mat-icon-button (click)="removeItem(item)" aria-label="Eliminar elemento">
                        <mat-icon>delete</mat-icon>
                    </button>
                    @if (actionIcon) {
                        <button mat-icon-button (click)="onAction(item)" class="mat-button-mini">
                            <mat-icon>edit</mat-icon>
                        </button>
                    }
                    @if (!keyView?.length) {
                        {{ item }}
                    } @else {
                        @for (key of keyView; let i = $index; track i) {
                            {{ item[key] }}@if (i < keyView.length - 1) {
                                ,
                            }
                        }
                    }
                </div>
            }
        </div>
    `
})
export class FormListComponent {
    @Input() items: any[] = [];
    @Input() title: string = 'List';
    @Input() keyView: string[];
    @Input() actionIcon: string = undefined;
    @Output() itemsChange = new EventEmitter<any[]>();
    @Output() action = new EventEmitter<any>();

    onDrop(event: CdkDragDrop<any[]>) {
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
        this.itemsChange.emit(this.items);
    }

    removeItem(item: any) {
        this.items = this.items.filter(i => i !== item);
        this.itemsChange.emit(this.items);
    }

    onAction(item: any) {
        this.action.emit(item);
    }

}
