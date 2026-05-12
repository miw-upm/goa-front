import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {Observable} from 'rxjs';
import {CapitalizeEnumNamePipe} from '@shared/pipes/capitalize-enum-name.pipe';

@Component({
    selector: 'app-form-select',
    standalone: true,
    imports: [
        FormsModule,
        AsyncPipe,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        CapitalizeEnumNamePipe
    ],
    templateUrl: './form-select.component.html',

})
export class FormSelectComponent {
    @Input() label = 'Select';
    @Input() values: Observable<string[]> = new Observable<string[]>();
    @Input() selected: string | undefined;
    @Input() capitalize = false;
    @Input() required = false;
    @Output() selectedChange = new EventEmitter<string>();
}

