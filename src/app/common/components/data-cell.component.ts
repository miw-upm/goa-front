import {Component, Input} from '@angular/core';
import {DatePipe, JsonPipe, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

@Component({
    selector: 'app-data-cell',
    templateUrl: './data-cell.component.html',
    imports: [
        NgSwitch,
        NgSwitchCase,
        JsonPipe,
        DatePipe,
        NgSwitchDefault
    ],
    styleUrls: ['./data-cell.component.css']
})
export class DataCellComponent {
    @Input() value: any;

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
