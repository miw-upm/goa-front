import {Component, Input} from '@angular/core';
import {DatePipe, DecimalPipe, CurrencyPipe} from '@angular/common';

import {CrudColumnConfig, CrudColumnFormat} from './crud-column.config';
import {UppercaseWordsPipe} from '@shared/pipes/uppercase-words.pipe';

@Component({
    standalone: true,
    selector: 'app-data-cell2',
    templateUrl: './data-cell2.component.html',
    styles: [`
        .cell-primary {
            font-weight: 500;
            color: rgba(0, 0, 0, 0.87);
        }

        .cell-secondary {
            font-size: 0.8rem;
            color: rgba(0, 0, 0, 0.54);
            margin-top: 2px;
        }

        .bool-chip {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
            line-height: 1.6;
        }

        .bool-green {
            background-color: #e1e4de;
            color: #38462c;
        }

        .bool-red {
            background-color: #ffdad6;
            color: #93000a;
        }

        .bool-primary {
            background-color: #f4e9dc;
            color: #5d3d17;
        }

        .bool-warn {
            background-color: #fff3e0;
            color: #e65100;
        }

        .bool-default {
            background-color: #eae8e6;
            color: #605950;
        }
    `],
    imports: [DatePipe, DecimalPipe, CurrencyPipe, UppercaseWordsPipe]
})
export class DataCell2Component {
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

    /** fields efectivos: si no hay ni fieldsTitle ni fields, se infiere [key] */
    private get effectiveFields(): string[] {
        return this.config?.fields?.length ? this.config.fields : (!this.config?.fieldsTitle?.length ? [this.config?.key ?? ''] : []);
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
            .map(f => this.row[f])
            .filter(v => v !== null && v !== undefined && v !== '')
            .join(sep);
    }

    /** Texto de fields: campos concatenados con separator */
    get fieldsValue(): string {
        const fields = this.effectiveFields;
        if (!fields.length || !this.row) return '';
        const sep = this.config?.separator ?? ' ';
        return fields
            .map(f => this.row[f])
            .filter(v => v !== null && v !== undefined && v !== '')
            .join(sep);
    }

    /** Valor único para formatos especiales (boolean, date, currency, number).
     *  Usa el primer campo de fieldsTitle o fields efectivos. */
    get singleValue(): any {
        if (!this.config || !this.row) return '';
        const field = this.config.fieldsTitle?.[0] ?? this.effectiveFields[0];
        return field ? this.row[field] : '';
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

    get booleanIcon(): string {
        return this.singleValue ? '✓' : '✗';
    }

    get booleanColorClass(): string {
        const cfg = this.config?.booleanConfig;
        const color = this.singleValue
            ? (cfg?.trueColor ?? 'green')
            : (cfg?.falseColor ?? 'red');
        return `bool-${color}`;
    }

    get dateFormat(): string {
        return this.config?.dateFormat ?? 'dd/MM/yyyy HH:mm';
    }

    // --- Legacy helpers (modo sin config, compatibilidad con v1) ---

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

    buildChangedFieldsText(obj: any): string {
        if (!obj || !this.changeFields?.length) return '';
        return this.changeFields
            .map(field => obj?.[field])
            .filter(v => v !== null && v !== undefined && v !== '')
            .join(' ');
    }
}
