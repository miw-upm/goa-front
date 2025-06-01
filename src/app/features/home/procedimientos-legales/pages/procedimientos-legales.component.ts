import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CrudComponent} from "@common/components/crud/crud.component";
import {FilterInputComponent} from "@common/components/inputs/filter-input.component";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ProcedimientoLegalSearch} from "./procedimiento-legal-search.model";
import {ProcedimientoLegalService} from "../procedimiento-legal.service";
import {ProcedimientoLegal} from "../procedimiento-legal.model";
import {
    ProcedimientoLegalCreationUpdatingDialogComponent
} from "../components/procedimiento-legal-creation-updating-dialog.component";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'procedimientos-legales.component.html'
})
export class ProcedimientosLegalesComponent {
    procedimientoLegalSearch: ProcedimientoLegalSearch;
    title = "Procedimientos Legales";
    procedimientosLegales = of([]);
    procedimientoLegal: Observable<any>;

    constructor(private readonly dialog: MatDialog, private readonly procedimientoLegalService: ProcedimientoLegalService) {
        this.resetSearch();
    }

    search(): void {
        this.procedimientosLegales = this.procedimientoLegalService.search(this.procedimientoLegalSearch);
    }

    resetSearch(): void {
        this.procedimientoLegalSearch = {};
    }

    create(): void {
        this.dialog
            .open(ProcedimientoLegalCreationUpdatingDialogComponent);
    }

    update(procedimientoLegal: ProcedimientoLegal): void {
        this.dialog.open(ProcedimientoLegalCreationUpdatingDialogComponent, {data: procedimientoLegal, width: '800px'})
            .afterClosed()
            .subscribe(() => this.search());
    }

    delete(procedimientoLegal: ProcedimientoLegal): void {
        this.procedimientoLegalService.delete(procedimientoLegal.id).subscribe(() => this.search());
    }

    read(procedimiento: ProcedimientoLegal): void {
        this.procedimientoLegal = this.procedimientoLegalService.read(procedimiento.id);
    }

}
