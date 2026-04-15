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
    errorMessage?: string;
    loading = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly publicEngagementLetterService: PublicEngagementLetterService,
    ) {
        this.token = this.route.snapshot.queryParamMap.get('token');
        this.load();
    }

    load(): void {
        if (!this.token) {
            this.errorMessage = 'El enlace no incluye un token válido.';
            return;
        }

        this.loading = true;
        this.errorMessage = undefined;
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
                    this.errorMessage = error?.message || 'No se ha podido cargar la hoja de encargo.';
                }
            });
    }
}
