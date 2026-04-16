import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineService } from '../services/timeline.service';
import { TimelineEvent } from '../models/timeline-event.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.css']
})
export class TimelinePageComponent implements OnInit {

  events: TimelineEvent[] = [];
  loading = true;
  engagementLetterId!: string;

  constructor(
    private timelineService: TimelineService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.engagementLetterId = this.route.snapshot.paramMap.get('id')!;
    this.loadTimeline();
  }

  loadTimeline(): void {
    this.timelineService.getTimelineEvents(this.engagementLetterId, false)
      .subscribe({
        next: (data) => {
          this.events = data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          this.loading = false;
        },
        error: () => {
          this.events = [];
          this.loading = false;
        }
      });
  }
}
