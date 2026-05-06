import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormFieldComponent} from './form-field.component';
import {NgModel} from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-form-nif',
    imports: [FormFieldComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-form-field
            #field
            [value]="value"
            (valueChange)="onValueChange($event)"
            [label]="label"
            [required]="required"
            [disabled]="disabled"
            [pattern]="NIF_PATTERN"
            [maxlength]="9"
            [errorMessage]="errorMessage"
        />
    `
})
export class FormNifComponent {
    @Input() label = 'N.I.F. (DNI, NIE o CIF)';
    @Input() value: string | undefined;
    @Input() required = false;
    @Input() disabled = false;
    @Input() errorMessage = 'DNI, NIE o CIF inválido';

    @Output() valueChange = new EventEmitter<string>();

    @ViewChild('field') private readonly field?: FormFieldComponent;

    readonly NIF_PATTERN =
        '^([0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]|[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J])$';

    get ngModel(): NgModel | undefined {
        return this.field?.ngModel;
    }

    onValueChange(raw: string): void {
        const normalized = this.normalize(raw);
        this.valueChange.emit(normalized);
    }

    private normalize(raw: string): string {
        if (raw == null) return raw;
        return raw.replace(/[\s\-_.]/g, '').toUpperCase();
    }
}
