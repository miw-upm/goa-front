import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

import {CrudComponent} from "@shared/ui/crud/crud.component";
import {FilterInputComponent} from "../../../../shared/ui/inputs/filters/filter-input.component";
import {LegalProcedureTemplate} from '../models/legal-procedure-template.model';
import {LegalProcedureFindCriteria} from "../models/legal-procedure-find-criteria.model";
import {LegalProcedureTemplateService} from "../legal-procedure-template.service";
import {
    LegalProcedureTemplateCreationUpdatingDialogComponent
} from "../dialogs/legal-procedure-template-creation-updating-dialog.component";
import {AuthService} from "@core/auth/auth.service";
import {TitleComponent} from "@shared/ui/title/title.component";
import {LEGAL_PROCEDURE_TEMPLATES_COLUMNS} from "./legal-procedure-templates-columns.config";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent, TitleComponent],
    templateUrl: 'legal-procedure-templates.component.html'
})
export class LegalProcedureTemplatesComponent {
    deleteVisibility: boolean = false;
    criteria: LegalProcedureFindCriteria;
    title = "Plantillas de Procedimientos Legales";
    templates: Observable<LegalProcedureTemplate[]> = of([]);
    template: Observable<LegalProcedureTemplate>;
    columns = LEGAL_PROCEDURE_TEMPLATES_COLUMNS;

    constructor(private readonly dialog: MatDialog, private readonly legalProcedureTemplateService: LegalProcedureTemplateService,
                auth: AuthService) {
        this.deleteVisibility = auth.isAdmin();
        this.resetSearch();
    }

    search(): void {
        this.templates = this.legalProcedureTemplateService.search(this.criteria);
    }

    resetSearch(): void {
        this.criteria = {};
    }

    create(): void {
        this.dialog.open(LegalProcedureTemplateCreationUpdatingDialogComponent)
            .afterClosed()
            .subscribe(() => {
                this.search();
            });
    }

    update(template: LegalProcedureTemplate): void {
        this.dialog.open(LegalProcedureTemplateCreationUpdatingDialogComponent, {data: template})
            .afterClosed()
            .subscribe(() => this.search());
    }

    delete(template: LegalProcedureTemplate): void {
        this.legalProcedureTemplateService.delete(template.id).subscribe(() => this.search());
    }

    read(template: LegalProcedureTemplate): void {
        this.template = this.legalProcedureTemplateService.read(template.id);
    }

}
