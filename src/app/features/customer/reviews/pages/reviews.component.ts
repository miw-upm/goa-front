import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBar} from '@angular/material/snack-bar';

import {ReviewService} from '../reviews.service';
import {Review} from '../models/review.model';
import {ReviewCreate} from '../models/review-create.model';
import {ReviewUpdate} from '../models/review-update.model';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatCardModule,
    ],
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
    letterId = '';
    stars: number | null = null;
    opinion = '';
    loadedReview?: Review;
    loading = false;
    saving = false;
    errorMessage = '';
    successMessage = '';
    hasExistingReview = false;

    private static readonly SNACK_DURATION = 4000;

    constructor(
        private readonly reviewService: ReviewService,
        private readonly snackBar: MatSnackBar
    ) {
    }

    loadReview(): void {
        const trimmed = this.letterId.trim();
        if (!trimmed) {
            this.errorMessage = 'El identificador del encargo es obligatorio.';
            return;
        }

        this.clearMessages();
        this.loading = true;
        this.reviewService.readByLetterId(trimmed).subscribe({
            next: (review: Review) => {
                this.loadedReview = review;
                this.stars = review.stars;
                this.opinion = review.opinion;
                this.hasExistingReview = true;
                this.loading = false;
            },
            error: (err: any) => {
                this.loading = false;
                const status = err?.status;
                if (status === 404) {
                    this.loadedReview = undefined;
                    this.stars = null;
                    this.opinion = '';
                    this.hasExistingReview = false;
                    this.errorMessage = '';
                } else {
                    this.errorMessage = 'No se pudo cargar la valoración. Inténtelo de nuevo.';
                    this.loadedReview = undefined;
                    this.stars = null;
                    this.opinion = '';
                    this.hasExistingReview = false;
                }
            }
        });
    }

    saveReview(): void {
        if (!this.isFormValid()) {
            return;
        }

        this.clearMessages();
        this.saving = true;

        if (this.hasExistingReview && this.loadedReview) {
            const update: ReviewUpdate = {
                stars: this.stars!,
                opinion: this.opinion.trim()
            };
            this.reviewService.update(this.letterId.trim(), update).subscribe({
                next: (review: Review) => {
                    this.loadedReview = review;
                    this.stars = review.stars;
                    this.opinion = review.opinion;
                    this.saving = false;
                    this.snackBar.open('Valoración actualizada correctamente.', '', {
                        duration: ReviewsComponent.SNACK_DURATION
                    });
                },
                error: () => {
                    this.saving = false;
                    this.snackBar.open('No se pudo actualizar la valoración. Inténtelo de nuevo.', '', {
                        duration: ReviewsComponent.SNACK_DURATION
                    });
                }
            });
        } else {
            const create: ReviewCreate = {
                letterId: this.letterId.trim(),
                stars: this.stars!,
                opinion: this.opinion.trim()
            };
            this.reviewService.createOrUpdate(create).subscribe({
                next: (review: Review) => {
                    this.loadedReview = review;
                    this.hasExistingReview = true;
                    this.saving = false;
                    this.snackBar.open('Valoración creada correctamente.', '', {
                        duration: ReviewsComponent.SNACK_DURATION
                    });
                },
                error: () => {
                    this.saving = false;
                    this.snackBar.open('No se pudo guardar la valoración. Inténtelo de nuevo.', '', {
                        duration: ReviewsComponent.SNACK_DURATION
                    });
                }
            });
        }
    }

    isFormValid(): boolean {
        this.clearMessages();
        const trimmedLetterId = this.letterId.trim();
        const trimmedOpinion = this.opinion.trim();

        if (!trimmedLetterId) {
            this.errorMessage = 'El identificador del encargo es obligatorio.';
            return false;
        }
        if (this.stars === null || this.stars < 1 || this.stars > 5) {
            this.errorMessage = 'La puntuación debe ser un valor entre 1 y 5.';
            return false;
        }
        if (!trimmedOpinion) {
            this.errorMessage = 'La opinión no puede estar vacía.';
            return false;
        }
        return true;
    }

    resetForm(): void {
        this.letterId = '';
        this.stars = null;
        this.opinion = '';
        this.loadedReview = undefined;
        this.hasExistingReview = false;
        this.clearMessages();
    }

    onStarClick(star: number): void {
        if (this.saving) {
            return;
        }
        this.stars = star;
    }

    private clearMessages(): void {
        this.errorMessage = '';
        this.successMessage = '';
    }
}
