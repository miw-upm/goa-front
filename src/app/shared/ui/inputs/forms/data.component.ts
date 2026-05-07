import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-form-date',
    imports: [
        FormsModule,
        MatFormField,
        MatSuffix,
        MatLabel,
        MatInput,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatIconModule
    ],
    template: `
        <mat-form-field class="full-width">
            <mat-label>{{ label }}</mat-label>
            <input
                    [ngModel]="dateValue"
                    (ngModelChange)="onDateChange($event)"
                    [matDatepicker]="picker"
                    [disabled]="disabled"
                    matInput
            />
            <mat-datepicker-toggle [for]="picker" matSuffix></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
    `,

})
export class AppDateFieldComponent implements OnChanges {
    @Input() label!: string;
    @Input() value: Date | string | null | undefined = null;
    @Output() valueChange = new EventEmitter<Date | null>();
    @Input() disabled = false;

    dateValue: Date | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value']) {
            const val = changes['value'].currentValue;
            if (!val) {
                this.dateValue = null;
            } else if (val instanceof Date) {
                this.dateValue = val;
            } else {
                this.dateValue = new Date(val);
            }
        }
    }

    onDateChange(date: Date | null): void {
        this.dateValue = date;
        this.valueChange.emit(date);
    }
}