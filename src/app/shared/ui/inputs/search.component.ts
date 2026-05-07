import {booleanAttribute, Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';

@Component({
    standalone: true,
    selector: 'app-search',
    templateUrl: 'search.component.html',
    imports: [
        FormsModule,
        AsyncPipe,
        MatFormField,
        MatLabel,
        MatSuffix,
        MatIcon,
        MatIconButton,
        MatTooltip,
        MatInput,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatOption
    ]
})
export class SearchComponent {
    inputValue = '';
    @Input() title = 'Search';
    @Input() key: any = null;
    @Input() keyView: string[];
    @Input() keys = of<any[]>([]);
    @Input({transform: booleanAttribute}) obligatory = false;

    @Output() keyChange = new EventEmitter<any>();
    @Output() renew = new EventEmitter<string>();
    @Output() selected = new EventEmitter<any>();

    onRenew(): void {
        this.renew.emit(this.inputValue);
    }

    resetKey(): void {
        this.key = null;
        this.inputValue = '';
        this.keyChange.emit(this.key);
    }

    onClick(value: any): void {
        this.key = value;
        this.keyChange.emit(value);
        this.selected.emit(value);
        this.inputValue = '';
    }
}
