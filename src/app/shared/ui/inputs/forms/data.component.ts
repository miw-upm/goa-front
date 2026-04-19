import {Component, EventEmitter, Input, Output} from '@angular/core';
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
    styles: [`
        .full-width {
            width: 100%;
        }
    `]
})
export class AppDateFieldComponent {
    @Input() label!: string;
    @Input() value: Date | string | null | undefined = null;
    @Output() valueChange = new EventEmitter<Date | null>();
    @Input() disabled = false;

    get dateValue(): Date | null {
        if (!this.value) return null;
        return this.value instanceof Date ? this.value : new Date(this.value);
    }

    onDateChange(date: Date | null): void {
        this.valueChange.emit(date);
    }
}
