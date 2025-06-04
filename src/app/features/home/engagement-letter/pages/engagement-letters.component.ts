import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CrudComponent} from "@common/components/crud/crud.component";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EngagementLetterService} from "../engagement-letter.service";
import {EngagementLetterSearch} from "./engagement-letter.search";
import {EngagementLetter} from "../engagement-letter.model";
import {FilterBooleanComponent} from "@common/components/inputs/filter-boolean.component";
import {
    EngagementLetterCreationUpdatingDialogComponent
} from "../components/engagement-letter-creation-updating-dialog.component";

@Component({
    standalone: true,
    imports: [
        FormsModule,
        CrudComponent,
        FilterBooleanComponent
    ],
    templateUrl: 'engagement-letters.component.html'
})
export class EngagementLettersComponent {
    title = "Hojas de Encargo";
    engagementLetters = of([]);
    engagementLetter: Observable<any>;
    criteria: EngagementLetterSearch

    constructor(private readonly dialog: MatDialog, private readonly engagementLettersService: EngagementLetterService) {
        this.resetSearch();
    }

    resetSearch(): void {
        this.criteria = {};
    }

    search(): void {
        this.engagementLetters = this.engagementLettersService.search(this.criteria);
    }

    create(): void {
        this.dialog.open(EngagementLetterCreationUpdatingDialogComponent);
    }

    update(procedure: EngagementLetter): void {
    }


    delete($event: any) {

    }

    read(engagement:EngagementLetter) {
        this.engagementLetter = this.engagementLettersService.read(engagement.id)
    }

}
