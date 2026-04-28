import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {filter, Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {CancelYesDialogComponent} from '@shared/ui/dialogs/cancel-yes-dialog.component';
import {ClipboardToastDialogComponent} from '@shared/ui/dialogs/clipboard-toast-dialog.component';
import {AuthService} from '@core/auth/auth.service';

import {EngagementLetterService} from '../engagement-letter.service';
import {EngagementLetterFindCriteria} from '../models/engagement-letter-find-criteria.model';
import {EngagementLetter} from '../models/engagement-letter.model';
import {ChatbotComponent} from '../../chatbot/pages/chatbot.component';
import {User} from '@features/shared/models/user.model';
import {SelectLetterLinkDialogComponent} from "../dialogs/select-letter-link-dialog.component";
import {switchMap} from "rxjs/operators";

@Component({
    standalone: true,
    providers: [EngagementLetterService],
    imports: [FormsModule, CrudComponent, FilterInputComponent, MatButtonToggleGroup, MatButtonToggle],
    templateUrl: 'engagement-letters.component.html'
})
export class EngagementLettersComponent implements OnInit {
    title = 'Hojas de Encargo';
    engagementLetters: Observable<EngagementLetter[]> = of([]);
    engagementLetter: Observable<EngagementLetter>;
    hiddenFields = ['id', 'discount', 'attachments', 'paymentMethods', 'legalClause']
    changeFields = ['owner:firstName,familyName,mobile'];

    deleteVisibility = false;
    criteria: EngagementLetterFindCriteria = {opened: true};

    constructor(private readonly dialog: MatDialog, private readonly engagementLettersService: EngagementLetterService,
                private readonly router: Router, private readonly route: ActivatedRoute, auth: AuthService) {
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
                message: '¿Estás seguro de eliminar esta Hoja de Encargo?\n\nSi es una Hoja antigua, podrían quedar conexiones rotas!!!'
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

    link(engagement: EngagementLetter): void {
        if (engagement.budgetOnly) {
            this.engagementLettersService.createBudgetAccessLink(engagement)
                .subscribe({
                    next: link => {
                        navigator.clipboard.writeText(link);
                        this.dialog.open(ClipboardToastDialogComponent, {
                            data: 'Enlace copiado al portapapeles'
                        });
                    }
                });
        } else {
            this.engagementLettersService.pendingSigners(engagement).pipe(
                switchMap(users => this.dialog.open(SelectLetterLinkDialogComponent, {
                    data: {users}
                }).afterClosed()),
                filter((user): user is User => !!user),
                switchMap(user => this.engagementLettersService.createLetterAccessLink(engagement, user))
            ).subscribe({
                next: link => {
                    navigator.clipboard.writeText(link);
                    this.dialog.open(ClipboardToastDialogComponent, {
                        data: 'Enlace copiado al portapapeles'
                    });
                }
            });
        }
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
