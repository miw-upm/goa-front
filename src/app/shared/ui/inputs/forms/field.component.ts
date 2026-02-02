import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule, NgModel, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-form-field',
    imports: [MatFormField, MatLabel, MatInput, MatError, FormsModule, MatIcon, MatSuffix],
    template: `
        <mat-form-field class="full-width">
            <mat-label>{{ label }}</mat-label>
            <input
                    [ngModel]="value"
                    (ngModelChange)="valueChange.emit($event)"
                    #ctrl="ngModel"
                    matInput
                    [type]="type"
                    [required]="required"
                    [pattern]="pattern"
                    [maxlength]="maxlength"
                    [minlength]="minlength"
                    [attr.name]="label"
                    [disabled]="disabled"
                    [attr.max]="max"
                    [attr.min]="min"
                    [step]="step"
            />
            @if (icon) {
                <mat-icon matSuffix>{{ icon }}</mat-icon>
            }
            @if (ctrl.invalid && (ctrl.dirty || ctrl.touched)) {
                <mat-error>{{ errorMessage }}</mat-error>
            }
        </mat-form-field>
    `,
    styles: [
        `
            .full-width {
                width: 100%;
            }
        `
    ]
})
export class FormFieldComponent {
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
    @Input() disabled!: boolean;
    @Input() icon?: string;
    @Output() valueChange = new EventEmitter<string>();
    @ViewChild('ctrl', {static: true}) ngModel!: NgModel;

    ngAfterViewInit(): void {
        const validators = [];
        if (this.required) validators.push(Validators.required);
        if (this.pattern) validators.push(Validators.pattern(this.pattern));
        if (this.min !== undefined) validators.push(Validators.min(this.min));
        if (this.max !== undefined) validators.push(Validators.max(this.max));
        if (this.minlength !== undefined) validators.push(Validators.minLength(this.minlength));
        if (this.maxlength !== undefined) validators.push(Validators.maxLength(this.maxlength));
        this.ngModel.control.setValidators(validators);
        this.ngModel.control.updateValueAndValidity();
    }
}
