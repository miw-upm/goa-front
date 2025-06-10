import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-form-select',
    standalone: true,
    imports: [
        FormsModule,
        AsyncPipe,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption
    ],
    template: `
        <mat-form-field class="full-width">
            <mat-label>{{ label }}</mat-label>
            <mat-select [(ngModel)]="selected" (ngModelChange)="selectedChange.emit($event)">
                @for (type of (values | async); track type) {
                    <mat-option [value]="type">{{ type }}</mat-option>
                }
            </mat-select>
        </mat-form-field>
    `,
    styles: [
        `
      .full-width {
        width: 100%;
      }
    `
    ]
})
export class DocumentTypeSelectComponent {
    @Input() label = 'Select';
    @Input() values: Observable<string[]> = new Observable<string[]>();
    @Input() selected: string | undefined;
    @Output() selectedChange = new EventEmitter<string>();
}

