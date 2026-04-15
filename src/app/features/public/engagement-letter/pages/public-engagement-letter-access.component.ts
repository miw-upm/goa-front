import {Component} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {finalize} from 'rxjs/operators';

import {PublicEngagementLetterService} from '../public-engagement-letter.service';
import {PublicEngagementLetter} from '../models/public-engagement-letter.model';
import {PublicEngagementLetterAcceptResponse} from '../models/public-engagement-letter-accept-response.model';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        DatePipe,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
    ],
    templateUrl: './public-engagement-letter-access.component.html',
    styleUrl: './public-engagement-letter-access.component.css'
})
export class PublicEngagementLetterAccessComponent {
    token: string | null;
    engagementLetter?: PublicEngagementLetter;
    loading = false;
    accepting = false;
    loadErrorMessage?: string;
    acceptErrorMessage?: string;
    acceptance?: PublicEngagementLetterAcceptResponse;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly publicEngagementLetterService: PublicEngagementLetterService,
    ) {
        this.token = this.route.snapshot.queryParamMap.get('token');
        this.load();
    }

    load(): void {
        if (!this.token) {
            this.loadErrorMessage = 'El enlace no incluye un token valido.';
            return;
        }

        this.loading = true;
        this.loadErrorMessage = undefined;
        this.acceptErrorMessage = undefined;
        this.publicEngagementLetterService.readByToken(this.token)
            .pipe(finalize(() => {
                this.loading = false;
            }))
            .subscribe({
                next: engagementLetter => {
                    this.engagementLetter = engagementLetter;
                },
                error: error => {
                    this.engagementLetter = undefined;
                    this.loadErrorMessage = error?.message || 'No se ha podido cargar la hoja de encargo.';
                }
            });
    }

    accept(): void {
        if (!this.token || this.accepting || this.acceptance) {
            return;
        }

        this.accepting = true;
        this.acceptErrorMessage = undefined;
        this.publicEngagementLetterService.accept(this.token)
            .pipe(finalize(() => {
                this.accepting = false;
            }))
            .subscribe({
                next: acceptance => {
                    this.acceptance = acceptance;
                },
                error: error => {
                    this.acceptErrorMessage = error?.message || 'No se ha podido aceptar la hoja de encargo.';
                }
            });
    }
}
