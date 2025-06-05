import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@common/components/inputs/search.component';
import {SharedLegalProcedureService} from "@shared/services/shared-legal-procedure.service";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-legal-procedure',
    templateUrl: './search-by-legal-procedure.component.html'
})
export class SearchByLegalProcedureComponent {
    procedures: Observable<string[]> = of([]);

    @Input() procedure: string;
    @Output() procedureChange = new EventEmitter<string>();

    constructor(private readonly sharedLegalProcedureService: SharedLegalProcedureService) {
    }

    public onSelect(value): void {
        this.procedureChange.emit(value);
    }

    searchByLegalProcedure(): void {
        this.procedures = this.sharedLegalProcedureService.searchProcedures(this.procedure);
    }
}
