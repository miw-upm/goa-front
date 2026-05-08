import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'app-filter-input',
    templateUrl: './filter-input.component.html',
    imports: [FormsModule, MatFormField, MatLabel, MatPrefix, MatSuffix, MatInput, MatIcon, MatIconButton]
})
export class FilterInputComponent {
    @Input() title: string = 'Filter';
    @Input() value: any = '';
    @Input() type: string = 'text';
    @Output() valueChange = new EventEmitter<string>();
    @Output() enter = new EventEmitter<void>();

    clearModel() {
        this.value = undefined;
        this.valueChange.emit(this.value);
    }
}