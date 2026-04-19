import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

import {CrudComponent} from "@shared/ui/crud/crud.component";
import {FilterInputComponent} from "@shared/ui/inputs/filter-input.component";
import {LegalProcedureTemplate} from '../models/legal-procedure-template.model';
import {LegalProcedureCriteria} from "../models/legal-procedure-criteria.model";
import {LegalProcedureTemplateService} from "../legal-procedure-template.service";
import {
    LegalProcedureTemplateCreationUpdatingDialogComponent
} from "../dialogs/legal-procedure-template-creation-updating-dialog.component";
import {AuthService} from "@core/auth/auth.service";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'legal-procedure-templates.component.html'
})
export class LegalProcedureTemplatesComponent {
    deleteVisibility: boolean = false;
    criteria: LegalProcedureCriteria;
    title = "Plantillas de Procedimientos Legales";
    templates: Observable<LegalProcedureTemplate[]> = of([]);
    template: Observable<LegalProcedureTemplate>;

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
