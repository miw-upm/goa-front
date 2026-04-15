import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {Router} from '@angular/router';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {CopyDialogComponent} from '@shared/ui/dialogs/copy-dialog.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {EngagementLetterService} from '../engagement-letter.service';
import {EngagementLetterSearch} from '../models/engagement-letter-search.model';
import {EngagementLetter} from '../models/engagement-letter.model';
import {
    EngagementLetterCreationUpdatingDialogComponent
} from '../dialogs/engagement-letter-creation-updating-dialog.component';
import {ChatbotComponent} from '../../chatbot/pages/chatbot.component';

@Component({
    standalone: true,
    providers: [EngagementLetterService],
    imports: [FormsModule, CrudComponent, MatSlideToggleModule, FilterInputComponent],
    templateUrl: 'engagement-letters.component.html'
})
export class EngagementLettersComponent {
    title = "Hojas de Encargo";
    engagementLetters = of([]);
    engagementLetter: Observable<any>;
    criteria: EngagementLetterSearch

    constructor(
        private readonly dialog: MatDialog,
        private readonly engagementLettersService: EngagementLetterService,
        private readonly router: Router
    ) {
        this.resetSearch();
    }

    resetSearch(): void {
        this.criteria = {opened: true, legalProcedureTitle: undefined};
    }

    search(): void {
        this.engagementLetters = this.engagementLettersService.search(this.criteria);
    }

    create(): void {
        this.dialog.open(EngagementLetterCreationUpdatingDialogComponent, {width: '800px'});
    }

    update(engagement: EngagementLetter): void {
        this.engagementLettersService.read(engagement.id).subscribe(engagementDb =>
            this.dialog.open(EngagementLetterCreationUpdatingDialogComponent, {data: engagementDb, width: '800px'})
                .afterClosed()
                .subscribe(() => this.search())
        );
    }

    delete(engagement: EngagementLetter) {
        this.engagementLettersService.delete(engagement.id).subscribe(() => this.search())
    }

    read(engagement: EngagementLetter) {
        this.engagementLetter = this.engagementLettersService.read(engagement.id)
    }

    openAssistant(engagement: EngagementLetter): void {
        if (!engagement?.id) {
            return;
        }

        this.dialog.open(ChatbotComponent, {
            data: {
                engagementLetterId: engagement.id
            },
            width: '960px',
            maxWidth: '96vw',
            height: '80vh',
            panelClass: 'contextual-chatbot-dialog-panel'
        });
    }

    navigateToEvents(engagement: EngagementLetter): void {
        if (!engagement?.id) return;
        void this.router.navigate(['/home/engagement-letters', engagement.id, 'events']);
    }

    generatePublicLink(engagement: EngagementLetter): void {
        if (!engagement?.id) {
            return;
        }
        this.engagementLettersService.createPublicAccessToken(engagement.id).subscribe(publicAccessToken =>
            this.dialog.open(CopyDialogComponent, {
                width: '700px',
                data: {
                    title: 'Enlace público generado',
                    message: publicAccessToken.publicUrl
                }
            })
        );
    }

}
