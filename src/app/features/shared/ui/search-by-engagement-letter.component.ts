import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@shared/ui/inputs/filters/search.component';
import {EngagementLetter} from '../../home/engagement-letter/engagement-letter/models/engagement-letter.model';
import {SharedEngagementLetterService} from '../services/shared-engagement-letter.service';

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-engagement-letter',
    templateUrl: './search-by-engagement-letter.component.html'
})
export class SearchByEngagementLetterComponent {
    engagementLetters: Observable<EngagementLetter[]> = of([]);

    @Input() engagementLetter: EngagementLetter;
    @Input() title = 'Buscar hoja de encargo';
    @Output() engagementLetterChange = new EventEmitter<EngagementLetter>();

    constructor(private readonly service: SharedEngagementLetterService) {
    }

    onSelect(engagementLetter: EngagementLetter): void {
        this.engagementLetterChange.emit(engagementLetter);
    }

    searchByClient(filter: string): void {
        this.engagementLetters = this.service.searchByClient(filter);
    }
}
