import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimelineEvent } from '../models/timeline-event.model';
import { ENDPOINTS } from '@core/api/endpoints';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(private http: HttpClient) {}

    getTimelineEvents(
      engagementId: string,
      ascending: boolean = false,
      type?: string,
      status?: string
    ): Observable<TimelineEvent[]> {

      let url = `${ENDPOINTS.events.byEngagementLetterId(engagementId)}/timeline-events?ascending=${ascending}`;

      if (type) {
        url += `&type=${type}`;
      }

      if (status) {
        url += `&status=${status}`;
      }

      return this.http.get<TimelineEvent[]>(url);
    }
}

