import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'app-filter-boolean',
    templateUrl: './filter-boolean.component.html',
    imports: [FormsModule, MatFormField, MatLabel, MatSuffix, MatSelect, MatOption, MatIcon, MatIconButton]
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