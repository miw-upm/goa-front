import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'app-filter-boolean',
    templateUrl: './filter-boolean.component.html',
    styleUrls: ['./filter.component.css'],
    imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatIconModule, MatButtonModule]
})
export class FilterBooleanComponent {
    @Input() value?: boolean;
    @Input() label: string = '¿Valor booleano?';

    @Output() valueChange = new EventEmitter<boolean | undefined>();

    clear(): void {
        this.value = undefined;
        this.valueChange.emit(this.value);
    }
}