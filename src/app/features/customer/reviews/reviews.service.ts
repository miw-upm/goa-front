import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService} from '@shared/ui/api/http.service';
import {ENDPOINTS} from '@core/api/endpoints';
import {Review} from './models/review.model';
import {ReviewCreate} from './models/review-create.model';
import {ReviewUpdate} from './models/review-update.model';

@Injectable({providedIn: 'root'})
export class ReviewService {

    constructor(private readonly httpService: HttpService) {
    }

    createOrUpdate(review: ReviewCreate): Observable<Review> {
        return this.httpService.request()
            .post<Review>(ENDPOINTS.reviews.root, review);
    }

    readByLetterId(letterId: string): Observable<Review> {
        return this.httpService.request()
            .get<Review>(ENDPOINTS.reviews.byLetterId(letterId));
    }

    update(letterId: string, review: ReviewUpdate): Observable<Review> {
        return this.httpService.request()
            .put<Review>(ENDPOINTS.reviews.byLetterId(letterId), review);
    }
}
