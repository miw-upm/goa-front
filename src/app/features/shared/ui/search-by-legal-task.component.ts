import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@shared/ui/inputs/search.component';
import {SharedLegalTaskService} from '../services/shared-legal-task.service';
import {LegalTask} from '../models/legal-task.model';

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-legal-task',
    templateUrl: './search-by-legal-task.component.html'
})
export class SearchByLegalTaskComponent {
    tasks: Observable<LegalTask[]> = of([]);

    @Input() task: LegalTask;
    @Output() taskChange = new EventEmitter<LegalTask>();

    constructor(private readonly sharedLegalTaskService: SharedLegalTaskService) {
    }

    public onSelect(value: LegalTask): void {
        this.taskChange.emit(value);
    }

    searchByLegalTask(filter: string): void {
        this.tasks = this.sharedLegalTaskService.searchTasks(filter);
    }
}
