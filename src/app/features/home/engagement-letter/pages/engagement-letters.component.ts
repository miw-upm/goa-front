import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {CancelYesDialogComponent} from '@shared/ui/dialogs/cancel-yes-dialog.component';
import {ClipboardToastDialogComponent} from '@shared/ui/dialogs/clipboard-toast-dialog.component';
import {AuthService} from '@core/auth/auth.service';

import {EngagementLetterService} from '../engagement-letter.service';
import {EngagementLetterCriteria} from '../models/engagement-letter-criteria.model';
import {EngagementLetter} from '../models/engagement-letter.model';
import {ChatbotComponent} from '../../chatbot/pages/chatbot.component';

@Component({
    standalone: true,
    providers: [EngagementLetterService],
    imports: [FormsModule, CrudComponent, FilterInputComponent, MatButtonToggleGroup, MatButtonToggle],
    templateUrl: 'engagement-letters.component.html'
})
export class EngagementLettersComponent implements OnInit {
    deleteVisibility = false;
    title = 'Hojas de Encargo';
    engagementLetters: Observable<EngagementLetter[]> = of([]);
    engagementLetter: Observable<EngagementLetter>;
    criteria: EngagementLetterCriteria = {opened: true};
    changeFields = ['owner:firstName.familyName.mobile'];

    constructor(
        private readonly dialog: MatDialog,
        private readonly engagementLettersService: EngagementLetterService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        auth: AuthService
    ) {
        this.deleteVisibility = auth.isAdmin();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const hasParams = Object.keys(params).length > 0;
            this.criteria = {
                opened: this.parseBoolean(params['opened'], hasParams ? null : true),
                budgetOnly: this.parseBoolean(params['budgetOnly'], null),
                client: params['client'] ?? undefined,
                legalProcedureTitle: params['legalProcedureTitle'] ?? undefined,
                taskTitle: params['taskTitle'] ?? undefined
            };
            if (hasParams) {
                this.search();
            }
        });
    }

    search(): void {
        this.engagementLetters = this.engagementLettersService.search(this.criteria);
    }

    create(): void {
        this.router.navigate(['/home/engagement-letters/new'], {
            queryParams: this.buildQueryParams()
        });
    }

    update(engagement: EngagementLetter): void {
        this.router.navigate(['/home/engagement-letters', engagement.id, 'edit'], {
            queryParams: this.buildQueryParams()
        });
    }

    delete(engagement: EngagementLetter): void {
        this.dialog.open(CancelYesDialogComponent, {
            data: {
                title: 'Opción peligrosa!!!',
                message: '¿Estás seguro de eliminar esta hoja de encargo?\n\nSi es una Hoja antigua, podrían quedar conexiones rotas!!!'
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                this.engagementLettersService.delete(engagement.id).subscribe(() => this.search());
            }
        });
    }

    read(engagement: EngagementLetter): void {
        this.engagementLetter = this.engagementLettersService.read(engagement.id);
    }

    print(engagement: EngagementLetter): void {
        this.engagementLettersService.print(engagement.id).subscribe();
    }

    openAssistant(engagement: EngagementLetter): void {
        if (!engagement?.id) return;
        this.dialog.open(ChatbotComponent, {
            data: {engagementLetterId: engagement.id},
            width: '960px',
            maxWidth: '96vw',
            height: '80vh',
            panelClass: 'contextual-chatbot-dialog-panel'
        });
    }

    navigateToEvents(engagement: EngagementLetter): void {
        if (!engagement?.id) return;
        this.router.navigate(['/home/engagement-letters', engagement.id, 'events']);
    }

    navigateToAlerts(engagement: EngagementLetter): void {
        if (!engagement?.id) return;
        this.router.navigate(['/home/engagement-letters', engagement.id, 'alerts']);
    }

    generatePublicLink(engagement: EngagementLetter): void {
        if (!engagement?.id) return;
        this.engagementLettersService.createPublicAccessToken(engagement.id).subscribe(token =>
            this.dialog.open(ClipboardToastDialogComponent, {
                data: {
                    message: 'Enlace público copiado al portapapeles',
                    clipboard: token.publicUrl
                }
            })
        );
    }

    private parseBoolean(value: string | undefined, defaultValue: boolean | null): boolean | null {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === 'null') return null;
        return defaultValue;
    }

    private buildQueryParams(): object {
        return {
            opened: this.criteria.opened,
            budgetOnly: this.criteria.budgetOnly,
            client: this.criteria.client ?? null,
            legalProcedureTitle: this.criteria.legalProcedureTitle ?? null,
            taskTitle: this.criteria.taskTitle ?? null
        };
    }
}
