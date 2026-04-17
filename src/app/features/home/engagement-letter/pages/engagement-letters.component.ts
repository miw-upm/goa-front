import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {Router} from '@angular/router';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {EngagementLetterService} from '../engagement-letter.service';
import {EngagementLetterSearch} from '../models/engagement-letter-search.model';
import {EngagementLetter} from '../models/engagement-letter.model';
import {
    EngagementLetterCreationUpdatingDialogComponent
} from '../dialogs/engagement-letter-creation-updating-dialog.component';
import {ChatbotComponent} from '../../chatbot/pages/chatbot.component';
import {AuthService} from "@core/auth/auth.service";
import {ClipboardToastDialogComponent} from "@shared/ui/dialogs/clipboard-toast-dialog.component";
import {WarningDialogComponent} from "@shared/ui/dialogs/warning-dialog.component";
import {CancelYesDialogComponent} from "@shared/ui/dialogs/cancel-yes-dialog.component";
import {
    LegalTaskCreationUpdatingDialogComponent
} from "../../legal-tasks/dialogs/legal-task-creation-updating-dialog.component";

@Component({
    standalone: true,
    providers: [EngagementLetterService],
    imports: [FormsModule, CrudComponent, MatSlideToggleModule, FilterInputComponent],
    templateUrl: 'engagement-letters.component.html'
})
export class EngagementLettersComponent {
    deleteVisibility: boolean = false;
    title = "Hojas de Encargo";
    engagementLetters = of([]);
    engagementLetter: Observable<any>;
    criteria: EngagementLetterSearch

    constructor(
        private readonly dialog: MatDialog,
        private readonly engagementLettersService: EngagementLetterService,
        private readonly router: Router, auth: AuthService
    ) {
        this.deleteVisibility = auth.isAdmin();
        this.resetSearch();
    }

    resetSearch(): void {
        this.criteria = {opened: true, legalProcedureTitle: undefined};
    }

    search(): void {
        this.engagementLetters = this.engagementLettersService.search(this.criteria);
    }

    create(): void {
        this.dialog.open(EngagementLetterCreationUpdatingDialogComponent, {width: '800px'})
            .afterClosed()
            .subscribe(() => {
                this.search();
            });
    }

    update(engagement: EngagementLetter): void {
        this.engagementLettersService.read(engagement.id).subscribe(engagementDb =>
            this.dialog.open(EngagementLetterCreationUpdatingDialogComponent, {data: engagementDb, width: '800px'})
                .afterClosed()
                .subscribe(() => this.search())
        );
    }

    delete(engagement: EngagementLetter) {
        this.dialog.open(CancelYesDialogComponent, {
            data: {
                title:'Opeción peligrosa!!!',
                message: '¿Estás seguro de eliminar esta hoja de encargo?\n\nSi es una Hoja antigua, podrían quedar conexiones rotas!!!' }
        }).afterClosed().subscribe(result => {
            if (result) {
                this.engagementLettersService.delete(engagement.id).subscribe(() => this.search());
            }
        });
    }

    read(engagement: EngagementLetter) {
        this.engagementLetter = this.engagementLettersService.read(engagement.id)
    }

    print(engagement: EngagementLetter) {
        this.engagementLettersService.print(engagement.id).subscribe();
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


    navigateToAlerts(engagement: EngagementLetter): void {
        if (!engagement?.id) return;
        void this.router.navigate(['/home/engagement-letters', engagement.id, 'alerts']);
    }

    generatePublicLink(engagement: EngagementLetter): void {
        if (!engagement?.id) {
            return;
        }
        this.engagementLettersService.createPublicAccessToken(engagement.id).subscribe(publicAccessToken =>
            this.dialog.open(ClipboardToastDialogComponent, {
                data: {
                    message: 'Enlace público copiado al portapapeles',
                    clipboard: publicAccessToken.publicUrl
                }
            })
        );
    }

}
