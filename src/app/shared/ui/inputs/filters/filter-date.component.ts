import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
    standalone: true,
    selector: 'app-filter-date',
    templateUrl: './filter-date.component.html',
    imports: [
        FormsModule,
        MatFormField,
        MatLabel,
        MatSuffix,
        MatInput,
        MatIcon,
        MatIconButton,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatNativeDateModule
    ]
})
export class FilterDateComponent {
    @Input() title: string = 'Fecha';
    @Input() date: Date | string | undefined;

    @Output() dateChange = new EventEmitter<Date | string | undefined>();

    onDateChange(): void {
        this.dateChange.emit(this.date);
    }

    clearDate(): void {
        this.date = undefined;
        this.dateChange.emit(this.date);
    }
}

