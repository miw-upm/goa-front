import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@common/components/search.component';
import {SharedTareaLegalService} from "./shared-tarea-legal.service";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-tarea-legal',
    templateUrl: './search-by-tarea-legal.component.html'
})
export class SearchByTareaLegalComponent {
    tareas: Observable<string[]> = of([]);

    @Input() tarea: string;
    @Output() add = new EventEmitter<string>();

    constructor(private readonly sharedTareaLegalService: SharedTareaLegalService) {
    }

    public onSelect(value): void {
        this.add.emit(value);
    }

    searchByTareaLegal(): void {
        this.tareas = this.sharedTareaLegalService.searchTareas(this.tarea);
    }
}
