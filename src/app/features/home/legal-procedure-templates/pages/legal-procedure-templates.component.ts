import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {map} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

import {CrudComponent} from "@shared/ui/crud/crud.component";
import {FilterInputComponent} from "@shared/ui/inputs/filter-input.component";
import {LegalProcedureSearch} from "../models/legal-procedure-search.model";
import {LegalProcedureTemplateService} from "../legal-procedure-template.service";
import {LegalProcedureTemplate} from "../../../common/models/legal-procedure-template.model";
import {
    LegalProcedureTemplateCreationUpdatingDialogComponent
} from "../components/legal-procedure-template-creation-updating-dialog.component";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'legal-procedure-templates.component.html'
})
export class LegalProcedureTemplatesComponent {
    legalProcedureSearch: LegalProcedureSearch;
    title = "Plantillas de Procedimientos Legales";
    legalProcedures = of([]);
    legalProcedure: Observable<any>;

    constructor(private readonly dialog: MatDialog, private readonly legalProcedureService: LegalProcedureTemplateService) {
        this.resetSearch();
    }

    search(): void {
        this.legalProcedures = this.legalProcedureService.search(this.legalProcedureSearch);
    }

    resetSearch(): void {
        this.legalProcedureSearch = {};
    }

    create(): void {
        this.dialog.open(LegalProcedureTemplateCreationUpdatingDialogComponent);
    }

    update(procedure: LegalProcedureTemplate): void {
        this.dialog.open(LegalProcedureTemplateCreationUpdatingDialogComponent, {data: procedure})
            .afterClosed()
            .subscribe(() => this.search());
    }

    delete(procedure: LegalProcedureTemplate): void {
        this.legalProcedureService.delete(procedure.id).subscribe(() => this.search());
    }

    read(procedure: LegalProcedureTemplate): void {
        this.legalProcedure = this.legalProcedureService.read(procedure.id)
            .pipe(
                map(template => ({
                    ...template,
                    legalTasks: template.legalTasks.map(task => task.title)
                }))
            );
    }

}
