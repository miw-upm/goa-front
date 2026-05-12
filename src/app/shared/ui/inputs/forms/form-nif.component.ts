import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AbstractControl, NgModel, ValidationErrors} from '@angular/forms';
import {FormFieldComponent} from './form-field.component';

@Component({
    standalone: true,
    selector: 'app-form-nif',
    imports: [FormFieldComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form-nif.component.html'
})
export class FormNifComponent implements AfterViewInit {
    private static readonly DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
    private static readonly NIE_PREFIX_MAP: Record<string, string> = {X: '0', Y: '1', Z: '2'};
    private static readonly CIF_LETTERS = 'JABCDEFGHI';
    @Input() label = 'N.I.F. (DNI, NIE o CIF)';
    @Input() value: string | undefined;
    @Input() required = false;
    @Input() disabled = false;
    @Input() errorMessage = 'DNI, NIE o CIF inválido';
    @Output() valueChange = new EventEmitter<string>();
    readonly NIF_PATTERN =
        '^([0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]|[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J])$';
    @ViewChild('field', {static: true}) private readonly field?: FormFieldComponent;

    get ngModel(): NgModel | undefined {
        return this.field?.ngModel;
    }

    private static padDniWithZeros(value: string): string {
        const match = /^(\d{1,7})([A-Z])$/.exec(value);
        if (!match) return value;
        const [, digits, letter] = match;
        return digits.padStart(8, '0') + letter;
    }

    private static hasValidCheckDigit(value: string): boolean {
        if (/^\d{8}[A-Z]$/.test(value)) return FormNifComponent.isValidDni(value);
        if (/^[XYZ]\d{7}[A-Z]$/.test(value)) return FormNifComponent.isValidNie(value);
        if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(value)) return FormNifComponent.isValidCif(value);
        return true;
    }

    private static isValidDni(value: string): boolean {
        const number = parseInt(value.slice(0, 8), 10);
        return value.charAt(8) === FormNifComponent.DNI_LETTERS[number % 23];
    }

    private static isValidNie(value: string): boolean {
        const numericPrefix = FormNifComponent.NIE_PREFIX_MAP[value.charAt(0)];
        const number = parseInt(numericPrefix + value.slice(1, 8), 10);
        return value.charAt(8) === FormNifComponent.DNI_LETTERS[number % 23];
    }

    private static isValidCif(value: string): boolean {
        const digits = value.slice(1, 8);
        let evenSum = 0;
        let oddSum = 0;
        for (let i = 0; i < digits.length; i++) {
            const digit = parseInt(digits.charAt(i), 10);
            if (i % 2 === 0) {
                const doubled = digit * 2;
                oddSum += Math.floor(doubled / 10) + (doubled % 10);
            } else {
                evenSum += digit;
            }
        }
        const totalLastDigit = (evenSum + oddSum) % 10;
        const controlDigit = totalLastDigit === 0 ? 0 : 10 - totalLastDigit;
        const controlChar = value.charAt(8);
        const firstChar = value.charAt(0);

        if ('KPQS'.includes(firstChar)) {
            return controlChar === FormNifComponent.CIF_LETTERS[controlDigit];
        }
        if ('ABEH'.includes(firstChar)) {
            return controlChar === String(controlDigit);
        }
        return controlChar === String(controlDigit) || controlChar === FormNifComponent.CIF_LETTERS[controlDigit];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const control = this.field?.ngModel?.control;
            if (!control) return;
            control.addValidators((c: AbstractControl): ValidationErrors | null => {
                const v: string = c.value;
                if (!v) return null;
                return FormNifComponent.hasValidCheckDigit(v) ? null : {nif: true};
            });
            control.updateValueAndValidity();
            if (control.invalid) {
                control.markAsTouched();
            }
        });
    }

    onValueChange(raw: string): void {
        const normalized = this.normalize(raw);
        this.valueChange.emit(normalized);
    }

    private normalize(raw: string): string {
        if (raw == null) return raw;
        const cleaned = raw.replace(/[\s\-_.]/g, '').toUpperCase();
        return FormNifComponent.padDniWithZeros(cleaned);
    }
}
