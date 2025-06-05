import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@common/components/inputs/search.component';
import {SharedLegalTaskService} from "../services/shared-legal-task.service";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-legal-task',
    templateUrl: './search-by-legal-task.component.html'
})
export class SearchByLegalTaskComponent {
    tasks: Observable<string[]> = of([]);

    @Input() task: string;
    @Output() taskChange = new EventEmitter<string>();

    constructor(private readonly sharedLegalTaskService: SharedLegalTaskService) {
    }

    public onSelect(value): void {
        this.taskChange.emit(value);
    }

    searchByLegalTask(): void {
        this.tasks = this.sharedLegalTaskService.searchTasks(this.task);
    }
}
