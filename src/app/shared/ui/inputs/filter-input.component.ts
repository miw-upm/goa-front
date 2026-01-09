import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'app-filter-input',
    templateUrl: './filter-input.component.html',
    styleUrls: ['./filter.component.css'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class FilterInputComponent {
    @Input() title: string = 'Filter';
    @Input() value: any = '';
    @Input() type: string = 'text';
    @Output() valueChange = new EventEmitter<string>();

    clearModel() {
        this.value = undefined;
        this.valueChange.emit(this.value);
    }
}