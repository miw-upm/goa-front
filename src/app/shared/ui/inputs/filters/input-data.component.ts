import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';

@Component({
    standalone: true,
    selector: 'app-input-data',
    templateUrl: 'input-data.component.html',
    imports: [FormsModule, MatFormField, MatLabel, MatSuffix, MatInput, MatIcon, MatIconButton]
})
export class InputData {
    @Input() title: string = 'Input text';
    @Input() icon: string = 'add_circle';
    @Input() type: string = 'text';
    @Output() action = new EventEmitter<string>();

    value = '';

    submit(): void {
        const trimmed = this.value.trim();
        if (trimmed) {
            this.action.emit(trimmed);
            this.value = '';
        }
    }

}