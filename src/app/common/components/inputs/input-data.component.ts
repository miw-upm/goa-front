import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
    standalone: true,
    selector: 'app-input-data',
    templateUrl: 'input-data.component.html',
    styles: [
        `
            .full-width {
                width: 100%;
            }
        `
    ],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
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