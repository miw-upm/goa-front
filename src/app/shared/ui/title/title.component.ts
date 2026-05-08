import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-title',
    imports: [MatButtonModule, MatIconModule],
    template: `
        <div class="app-title">
            <div class="app-title__header">
                <div>
                    <h1 class="app-title__text">{{ title }}</h1>
                    @if (subtitle) {
                        <p class="app-title__subtitle">{{ subtitle }}</p>
                    }
                </div>
                <div class="app-title__actions">
                    @if (createAction) {
                        <button mat-flat-button class="app-title__create" (click)="create.emit()">
                            <mat-icon>add</mat-icon>
                            Crear
                        </button>
                    }
                    @if (cancelAction) {
                        <button mat-stroked-button class="app-title__cancel" (click)="cancel.emit()">
                            Cancelar
                        </button>
                    }
                    @if (saveAction) {
                        <button mat-flat-button class="app-title__create" (click)="save.emit()"
                                [disabled]="saveDisabled">
                            <mat-icon>{{ saveIcon }}</mat-icon>
                            {{ saveLabel }}
                        </button>
                    }
                </div>
            </div>
        </div>
    `,
    styles: `
        .app-title {
            padding: 24px 24px 16px;
        }

        .app-title__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .app-title__text {
            margin: 0;
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: var(--mat-sys-on-surface);
        }

        .app-title__subtitle {
            margin: 4px 0 0;
            font-size: 0.9rem;
            color: var(--mat-sys-on-surface-variant);
            font-weight: 400;
        }

        .app-title__actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .app-title__create {
            --mdc-filled-button-container-color: #4A5D3A;
            --mdc-filled-button-label-text-color: #ffffff;
            border-radius: 12px;
        }

        .app-title__cancel {
            border-radius: 12px;
        }
    `,
})
export class TitleComponent {
    @Input() title = '';
    @Input() subtitle?: string;

    @Input() createAction = false;
    @Output() create = new EventEmitter<void>();

    @Input() cancelAction = false;
    @Output() cancel = new EventEmitter<void>();

    @Input() saveAction = false;
    @Input() saveLabel = 'Guardar';
    @Input() saveIcon = 'save';
    @Input() saveDisabled = false;
    @Output() save = new EventEmitter<void>();
}
