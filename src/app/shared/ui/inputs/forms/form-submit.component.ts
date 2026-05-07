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
    template: `
        <div class="submit-wrapper">
            @if (state() === 'warning') {
                <mat-icon class="submit-icon--warning" aria-label="Aviso en el envío">warning_amber</mat-icon>
            }
            @if (state() === 'error') {
                <mat-icon class="submit-icon--error" aria-label="Error en el envío">error_outline</mat-icon>
            }
            <button mat-flat-button
                    type="button"
                    [disabled]="disabled || state() === 'loading'"
                    (click)="onClick()"
                    [class.warn]="state() === 'error'">
                @if (state() === 'idle' && icon) {
                    <mat-icon>{{ icon }}</mat-icon>
                }
                @if (state() === 'success') {
                    <mat-icon>check</mat-icon>
                }
                @if (state() === 'loading') {
                    <mat-spinner diameter="20"></mat-spinner>
                } @else {
                    <span>{{ label }}</span>
                }
            </button>
        </div>

        @if (message()) {
            <div class="submit-feedback"
                 [class.submit-feedback--success]="state() === 'success'"
                 [class.submit-feedback--warning]="state() === 'warning'"
                 [class.submit-feedback--error]="state() === 'error'"
                 role="status"
                 aria-live="polite">
                <p>{{ message() }}</p>
            </div>
        }
    `
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
