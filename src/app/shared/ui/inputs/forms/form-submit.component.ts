import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

export type FormSubmitState = 'idle' | 'loading' | 'success' | 'warning' | 'error';

@Component({
    standalone: true,
    selector: 'app-form-submit',
    imports: [MatButton, MatIcon, MatProgressSpinner],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form-submit.component.html'
})
export class FormSubmitComponent {
    @Input() label = 'ENVIAR';
    @Input() icon?: string;
    @Input() disabled = false;

    @Output() submitted = new EventEmitter<void>();

    readonly state = signal<FormSubmitState>('idle');
    readonly message = signal<string>('');

    onClick(): void {
        if (this.disabled || this.state() === 'loading') return;
        this.state.set('loading');
        this.message.set('');
        this.submitted.emit();
    }

    markSuccess(message = ''): void {
        this.state.set('success');
        this.message.set(message);
    }

    markWarning(message = ''): void {
        this.state.set('warning');
        this.message.set(message);
    }

    markError(message = ''): void {
        this.state.set('error');
        this.message.set(message);
    }

    reset(): void {
        this.state.set('idle');
        this.message.set('');
    }
}
