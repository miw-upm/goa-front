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
                <mat-icon class="warning-icon" aria-label="Aviso en el envío">warning_amber</mat-icon>
            }
            @if (state() === 'error') {
                <mat-icon class="error-icon" aria-label="Error en el envío">error_outline</mat-icon>
            }
            <button mat-raised-button
                    type="button"
                    [color]="color"
                    [disabled]="disabled || state() === 'loading'"
                    (click)="onClick()"
                    class="submit-button">
                @if (state() === 'idle' && icon) {
                    <mat-icon>{{ icon }}</mat-icon>
                }
                @if (state() === 'success') {
                    <mat-icon>check</mat-icon>
                }
                @if (state() === 'loading') {
                    <mat-spinner class="inline-spinner" diameter="20"></mat-spinner>
                } @else {
                    <span>{{ label }}</span>
                }
            </button>
        </div>

        @if (message()) {
            <div class="feedback"
                 [class.feedback--success]="state() === 'success'"
                 [class.feedback--warning]="state() === 'warning'"
                 [class.feedback--error]="state() === 'error'"
                 role="status"
                 aria-live="polite">
                <p class="feedback-message">{{ message() }}</p>
            </div>
        }
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
        }

        .submit-wrapper {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .warning-icon {
            color: #ed6c02;
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
        }

        .error-icon {
            color: #d32f2f;
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
        }

        .inline-spinner {
            display: inline-block;
            --mdc-circular-progress-active-indicator-color: currentColor;
        }

        .submit-button {
            min-width: 9rem;
        }

        .feedback {
            padding: 16px 20px;
            border-left: 4px solid;
            border-radius: 4px;
            text-align: center;
        }

        .feedback--success {
            border-left-color: #2e7d32;
            background: #f1f8f4;
        }

        .feedback--success .feedback-message {
            color: #1b4d20;
        }

        .feedback--warning {
            border-left-color: #ed6c02;
            background: #fff8e6;
        }

        .feedback--warning .feedback-message {
            color: #6b3e00;
        }

        .feedback--error {
            border-left-color: #c62828;
            background: #fdecea;
        }

        .feedback--error .feedback-message {
            color: #5f1612;
        }

        .feedback-message {
            margin: 0;
            font-size: 1rem;
        }
    `]
})
export class FormSubmitComponent {
    @Input() label = 'ENVIAR';
    @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
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
