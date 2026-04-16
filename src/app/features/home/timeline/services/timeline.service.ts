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

  getTimelineEvents(engagementId: string, ascending: boolean = false): Observable<TimelineEvent[]> {
    return this.http.get<TimelineEvent[]>(
      `${ENDPOINTS.events.timelineByEngagementLetterId(engagementId)}?ascending=${ascending}`
    );
  }
}

