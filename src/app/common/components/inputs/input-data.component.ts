import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
    standalone: true,
    selector: 'app-input-data',
    templateUrl: 'input-data.component.html',
    styleUrls: ['./filter.component.css'],
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class InputData {
    @Input() title: string = 'Input text';
    @Input() icon: string = 'add_circle';
    @Input() type: string = 'text';
    @Input() model: string = '';
    @Output() action = new EventEmitter<string>();

    control = new FormControl('');

    submit() {
        if (this.control.value) {
            this.action.emit(this.control.value);
            this.control.reset();
        }
    }
}