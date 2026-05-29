import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ENDPOINTS} from '@core/api/endpoints';
import {HttpService} from '@shared/ui/api/http.service';
import {EngagementLetter} from '../../home/engagement-letter/models/engagement-letter.model';

@Injectable({providedIn: 'root'})
export class SharedEngagementLetterService {
    constructor(private readonly httpService: HttpService) {
    }

    searchByClient(client: string): Observable<EngagementLetter[]> {
        return this.httpService.request()
            .param('client', client ?? '')
            .get<EngagementLetter[]>(ENDPOINTS.engagementLetters.root)
            .pipe(map(letters => letters.map(letter => ({
                ...letter,
                reference: letter.reference ?? letter.id?.substring(0, 4)
            }))));
    }
}
