import {booleanAttribute, Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatInput} from '@angular/material/input';
import {of} from 'rxjs';

@Component({
    standalone: true,
    imports: [MatFormField, MatIcon, MatAutocomplete, MatOption, AsyncPipe, MatIconButton, MatLabel, MatTooltip,
        FormsModule, MatAutocompleteTrigger, MatInput, MatSuffix],
    selector: 'app-search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.css']
})
export class SearchComponent {
    inputValue: string ='';
    @Input() title = 'Search';
    @Input() key: any = null;
    @Input() keyView:string[];
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

    trackOption(item: any): any {
        return item?.id ?? item;
    }
}
