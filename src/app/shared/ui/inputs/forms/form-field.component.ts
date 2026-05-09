import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule, NgModel, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-form-field',
    imports: [MatFormField, MatLabel, MatInput, MatError, FormsModule, MatIcon, MatSuffix],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form-field.component.html',

})
export class FormFieldComponent implements AfterViewInit {
    @Input() label!: string;
    @Input() value: string | number | undefined;
    @Input() errorMessage = 'Campo inválido';
    @Input() type = 'text';
    @Input() required = false;
    @Input() pattern?: string;
    @Input() maxlength?: number;
    @Input() minlength?: number;
    @Input() max?: number;
    @Input() min?: number;
    @Input() step?: number;
    @Input() disabled = false;
    @Input() icon?: string;
    @Output() valueChange = new EventEmitter<string>();
    @ViewChild('ctrl', {static: true}) ngModel!: NgModel;

    ngAfterViewInit(): void {
        setTimeout(() => {
            const validators = [];
            if (this.required) validators.push(Validators.required);
            if (this.pattern) validators.push(Validators.pattern(this.pattern));
            if (this.min !== undefined) validators.push(Validators.min(this.min));
            if (this.max !== undefined) validators.push(Validators.max(this.max));
            if (this.minlength !== undefined) validators.push(Validators.minLength(this.minlength));
            if (this.maxlength !== undefined) validators.push(Validators.maxLength(this.maxlength));
            this.ngModel.control.setValidators(validators);
            this.ngModel.control.updateValueAndValidity({emitEvent: false});
        });
    }
}
