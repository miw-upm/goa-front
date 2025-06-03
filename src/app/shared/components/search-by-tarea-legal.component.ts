import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@common/components/inputs/search.component';
import {SharedLegalTaskService} from "../services/shared-legal-task.service";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-tarea-legal',
    templateUrl: './search-by-tarea-legal.component.html'
})
export class SearchByTareaLegalComponent {
    tasks: Observable<string[]> = of([]);

    @Input() task: string;
    @Output() add = new EventEmitter<string>();

    constructor(private readonly sharedLegalTaskService: SharedLegalTaskService) {
    }

    public onSelect(value): void {
        this.add.emit(value);
    }

    searchByLegalTask(): void {
        this.tasks = this.sharedLegalTaskService.searchTasks(this.task);
    }
}
