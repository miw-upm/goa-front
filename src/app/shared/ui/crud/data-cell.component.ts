import {Component, Input} from '@angular/core';
import {DatePipe} from '@angular/common';

import {UppercaseWordsPipe} from "@shared/ui/pipes/uppercase-words.pipe";

@Component({
    standalone: true,
    selector: 'app-data-cell',
    templateUrl: './data-cell.component.html',
    styleUrls: ['./data-cell.component.css'],
    imports: [DatePipe, UppercaseWordsPipe]
})
export class DataCellComponent {
    @Input() value: any;
    @Input() fullList: boolean = false;
    protected readonly Object = Object;

    isArray(val: any): boolean {
        return Array.isArray(val);
    }

    isObject(val: any): boolean {
        return typeof val === 'object' && val !== null && !Array.isArray(val);
    }

    isDate(val: any): boolean {
        return typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val);
    }

    getFirstKey(obj: any): string {
        return Object.entries(obj)[0]?.[0] ?? '';
    }

    getFirstValue(obj: any): any {
        return Object.entries(obj)[0]?.[1];
    }
}
