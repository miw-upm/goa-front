import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimelineEvent } from '../models/timeline-event.model';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  private baseUrl = '/events';

  constructor(private http: HttpClient) {}

  getTimelineEvents(engagementLetterId: string, ascending = false): Observable<TimelineEvent[]> {
    return this.http.get<TimelineEvent[]>(
      `${this.baseUrl}/engagement-letter/${engagementLetterId}/timeline-events`,
      {
        params: {
          ascending: ascending
        }
      }
    );
  }
}
