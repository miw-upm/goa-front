import {Component, Input} from '@angular/core';
import {DatePipe, JsonPipe} from "@angular/common";
import {of} from "rxjs";

@Component({
    selector: 'app-data-cell',
    templateUrl: './data-cell.component.html',
    imports: [
        DatePipe,
        JsonPipe,
    ],
    styleUrls: ['./data-cell.component.css']
})
export class DataCellComponent {
    @Input() value: any;
    @Input() fullList: boolean = false;
    protected readonly of = of;
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
}
