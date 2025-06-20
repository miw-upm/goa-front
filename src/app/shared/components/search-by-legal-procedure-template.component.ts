import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@common/components/inputs/search.component';
import {SharedLegalProcedureService} from "@shared/services/shared-legal-procedure.service";
import {LegalProcedureTemplate} from "../models/legal-procedure-template.model";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-legal-procedure',
    templateUrl: './search-by-legal-procedure-template.component.html'
})
export class SearchByLegalProcedureTemplateComponent {
    procedures: Observable<LegalProcedureTemplate[]> = of([]);

    @Input() procedure: LegalProcedureTemplate;
    @Output() procedureChange = new EventEmitter<LegalProcedureTemplate>();

    constructor(private readonly sharedLegalProcedureService: SharedLegalProcedureService) {
    }

    public onSelect(procedure: LegalProcedureTemplate): void {
        this.procedureChange.emit(procedure);
    }

    searchByLegalProcedure(filter: string): void {
        this.procedures = this.sharedLegalProcedureService.searchProcedures(filter);
    }
}
