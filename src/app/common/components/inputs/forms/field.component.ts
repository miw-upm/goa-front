import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {
    MatFormField,
    MatLabel,
    MatError
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
    standalone: true,
    selector: 'app-form-field',
    imports: [MatFormField, MatLabel, MatInput, MatError, FormsModule],
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
            />
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
    @Input() value: string | undefined;
    @Input() errorMessage = 'Campo inválido';
    @Input() type = 'text';
    @Input() required = false;
    @Input() pattern?: string;
    @Input() maxlength?: number;
    @Input() minlength?: number;
    @Input() disabled!: boolean;
    @Output() valueChange = new EventEmitter<string>();
    @ViewChild('ctrl', { static: true }) ngModel!: NgModel;
}
