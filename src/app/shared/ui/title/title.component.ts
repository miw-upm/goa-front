import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-title',
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './title.component.html',
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
