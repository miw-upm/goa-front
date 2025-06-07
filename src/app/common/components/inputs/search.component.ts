import {booleanAttribute, Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule, MatAutocompleteTrigger,} from '@angular/material/autocomplete';
import {MatIconButton} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from "@angular/material/core";

@Component({
    standalone: true,
    selector: 'app-search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.css'],
    imports: [
        FormsModule,
        AsyncPipe,
        MatFormFieldModule,
        MatLabel,
        MatSuffix,
        MatIconModule,
        MatIconButton,
        MatTooltipModule,
        MatInputModule,
        MatAutocompleteModule,
        MatAutocompleteTrigger,
        MatOptionModule
    ]
})
export class SearchComponent {
    inputValue: string = '';
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

    trackOption(item: any): any {
        return item?.id ?? item;
    }
}
