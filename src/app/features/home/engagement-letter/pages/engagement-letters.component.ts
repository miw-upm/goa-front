import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CrudComponent} from "@common/components/crud/crud.component";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EngagementLetterService} from "../engagement-letter.service";
import {EngagementLetterSearchModel} from "./engagement-letter-search.model";
import {EngagementLetter} from "../engagement-letter.model";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent],
    templateUrl: 'engagement-letters.component.html'
})
export class EngagementLettersComponent {
    title = "Hojas de Encargo";
    engagementLetters = of([]);
    engagementLetter: Observable<any>;
    private engagementLetterSearch: EngagementLetterSearchModel

    constructor(private readonly dialog: MatDialog, private readonly legalProcedureService: EngagementLetterService) {
        this.resetSearch();
    }

    resetSearch(): void {
        this.engagementLetterSearch = {};
    }

    create(): void {
    }

    update(procedure: EngagementLetter): void {
    }


    delete($event: any) {

    }

    read($event: any) {

    }

    search() {

    }
}
