import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CrudComponent} from "@common/components/crud/crud.component";
import {Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EngagementLetterService} from "../engagement-letter.service";
import {EngagementLetterSearch} from "./engagement-letter.search";
import {EngagementLetter} from "../engagement-letter.model";
import {
    EngagementLetterCreationUpdatingDialogComponent
} from "../components/engagement-letter-creation-updating-dialog.component";

import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FilterInputComponent} from "@common/components/inputs/filter-input.component";

@Component({
    standalone: true,
    imports: [
        FormsModule,
        CrudComponent,
        MatSlideToggle,
        FilterInputComponent
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
        this.criteria = {opened:true,legalProcedureTitle:undefined};
    }

    search(): void {
        this.engagementLetters = this.engagementLettersService.search(this.criteria);
    }

    create(): void {
        this.dialog.open(EngagementLetterCreationUpdatingDialogComponent);
    }

    update(engagement: EngagementLetter): void {
        this.engagementLettersService.read(engagement.id).subscribe(engagementDb =>
            this.dialog.open(EngagementLetterCreationUpdatingDialogComponent, {data: engagementDb, width: '800px'})
                .afterClosed()
                .subscribe(() => this.search())
        );

    }

    delete(engagement:EngagementLetter) {
        this.engagementLettersService.delete(engagement.id).subscribe(()=>this.search())
    }

    read(engagement: EngagementLetter) {
        this.engagementLetter = this.engagementLettersService.read(engagement.id)
    }

}
