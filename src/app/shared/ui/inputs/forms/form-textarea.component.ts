import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule, NgModel, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';

@Component({
    standalone: true,
    selector: 'app-form-textarea',
    imports: [MatFormField, MatLabel, MatInput, MatError, FormsModule, MatIcon, MatSuffix],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form-textarea.component.html',
})
export class FormTextareaComponent implements AfterViewInit {
    @Input() label!: string;
    @Input() value: string | undefined;
    @Input() errorMessage = 'Campo invalido';
    @Input() required = false;
    @Input() pattern?: string;
    @Input() maxlength?: number;
    @Input() minlength?: number;
    @Input() disabled = false;
    @Input() icon?: string;
    @Input() rows = 3;
    @Output() valueChange = new EventEmitter<string>();
    @ViewChild('ctrl', {static: true}) ngModel!: NgModel;

    ngAfterViewInit(): void {
        setTimeout(() => {
            const validators = [];
            if (this.required) validators.push(Validators.required);
            if (this.pattern) validators.push(Validators.pattern(this.pattern));
            if (this.minlength !== undefined) validators.push(Validators.minLength(this.minlength));
            if (this.maxlength !== undefined) validators.push(Validators.maxLength(this.maxlength));
            this.ngModel.control.setValidators(validators);
            this.ngModel.control.updateValueAndValidity({emitEvent: false});
        });
    }
}
