import {Component, Input} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';

import {CrudColumnConfig, CrudColumnFormat} from './crud-column.config';
import {UppercaseWordsPipe} from '@shared/pipes/uppercase-words.pipe';

@Component({
    standalone: true,
    selector: 'app-data-cell2',
    templateUrl: './data-cell.component.html',
    imports: [DatePipe, DecimalPipe, CurrencyPipe, UppercaseWordsPipe]
})
export class DataCellComponent {
    @Input() row: any;
    @Input() config: CrudColumnConfig | undefined;
    /** Modo legacy: valor directo sin config */
    @Input() value: any;
    @Input() fullList = false;
    @Input() changeFields: string[] = [];

    protected readonly Object = Object;

    get hasConfig(): boolean {
        return !!this.config;
    }

    /** Tiene fieldsTitle → línea resaltada */
    get hasTitle(): boolean {
        return !!this.config?.fieldsTitle?.length;
    }

    /** Tiene fields → línea normal (secundaria si hay title, única si no) */
    get hasFields(): boolean {
        return this.effectiveFields.length > 0;
    }

    /** Texto de fieldsTitle: campos concatenados con separator */
    get titleValue(): string {
        if (!this.config?.fieldsTitle?.length || !this.row) return '';
        const sep = this.config.separator ?? ' ';
        return this.config.fieldsTitle
            .map(f => this.resolve(this.row, f))
            .filter(v => v !== null && v !== undefined && v !== '')
            .join(sep);
    }

    /** Texto de fields: campos concatenados con separator */
    get fieldsValue(): string {
        const fields = this.effectiveFields;
        if (!fields.length || !this.row) return '';
        const sep = this.config?.separator ?? ' ';
        return fields
            .map(f => this.resolve(this.row, f))
            .filter(v => v !== null && v !== undefined && v !== '')
            .join(sep);
    }

    /** Valor único para formatos especiales (boolean, date, currency, number).
     *  Usa el primer campo de fieldsTitle o fields efectivos. */
    get singleValue(): any {
        if (!this.config || !this.row) return '';
        const field = this.config.fieldsTitle?.[0] ?? this.effectiveFields[0];
        return field ? this.resolve(this.row, field) : '';
    }

    get format(): CrudColumnFormat {
        if (this.config?.format && this.config.format !== 'text') {
            return this.config.format;
        }
        const val = this.singleValue;
        if (typeof val === 'boolean') return 'boolean';
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) return 'date';
        return this.config?.format ?? 'text';
    }

    get booleanLabel(): string {
        const cfg = this.config?.booleanConfig;
        return this.singleValue
            ? (cfg?.trueLabel ?? 'SI')
            : (cfg?.falseLabel ?? 'NO');
    }

    get showBooleanIcon(): boolean {
        return this.config?.booleanConfig?.showIcon !== false;
    }

    get booleanIcon(): string {
        return this.singleValue ? '✓' : '✗';
    }

    get booleanColorClass(): string {
        const cfg = this.config?.booleanConfig;
        const color = this.singleValue
            ? (cfg?.trueColor ?? 'success')
            : (cfg?.falseColor ?? 'primary');
        return `bool-chip--${color}`;
    }

    get isArrayMode(): boolean {
        if (!this.config?.arrayField || !this.row) return false;
        const val = this.resolve(this.row, this.config.key);
        return Array.isArray(val);
    }

    get arrayFirst(): string {
        return this.arrayItems[0] ?? '';
    }

    // --- Array helpers (arrayField) ---

    get arraySecond(): string {
        return this.arrayItems[1] ?? '';
    }

    get arrayRemainingCount(): number {
        return Math.max(0, this.arrayItems.length - 2);
    }

    get dateFormat(): string {
        return this.config?.dateFormat ?? 'dd/MM/yyyy HH:mm';
    }

    /** fields efectivos: si no hay ni fieldsTitle ni fields, se infiere [key] */
    private get effectiveFields(): string[] {
        return this.config?.fields?.length ? this.config.fields : (!this.config?.fieldsTitle?.length ? [this.config?.key ?? ''] : []);
    }

    private get arrayItems(): string[] {
        if (!this.config?.arrayField || !this.row) return [];
        const arr = this.resolve(this.row, this.config.key);
        if (!Array.isArray(arr)) return [];
        return arr
            .map((item: any) => this.resolve(item, this.config.arrayField))
            .filter((v: any) => v !== null && v !== undefined && v !== '');
    }

    isArray(val: any): boolean {
        return Array.isArray(val);
    }

    // --- Legacy helpers (modo sin config, compatibilidad con v1) ---

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

    buildChangedFieldsText(obj: any): string {
        if (!obj || !this.changeFields?.length) return '';
        return this.changeFields
            .map(field => obj?.[field])
            .filter(v => v !== null && v !== undefined && v !== '')
            .join(' ');
    }

    /** Resuelve un path con dot notation (ej: 'owner.firstName') sobre un objeto */
    private resolve(obj: any, path: string): any {
        return path.split('.').reduce((o, k) => o?.[k], obj);
    }
}
