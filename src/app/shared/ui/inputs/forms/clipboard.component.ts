import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
    standalone: true,
    selector: 'app-form-clipboard',
    imports: [MatFormField, MatLabel, MatInput, FormsModule, MatIcon, MatIconButton, MatSuffix, MatTooltip],
    templateUrl: './clipboard.component.html',


})
export class ClipboardComponent {
    @Input() label!: string;
    @Input() value: string | undefined;
    @Output() valueChange = new EventEmitter<string>();

    copyToClipboard(): void {
        navigator.clipboard.writeText(this.value).then();
    }
}
