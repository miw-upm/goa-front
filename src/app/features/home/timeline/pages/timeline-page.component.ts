import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TimelineService } from '../services/timeline.service';
import { TimelineEvent } from '../models/timeline-event.model';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.css']
})
export class TimelinePageComponent implements OnInit {

  events: TimelineEvent[] = [];
  loading = true;

  engagementLetterId!: string;


  typeFilter: string = '';
  statusFilter: string = '';
  ascending = false;

  constructor(
    private timelineService: TimelineService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.engagementLetterId = this.route.snapshot.paramMap.get('id')!;
    this.loadTimeline();
  }

  loadTimeline(): void {
    this.loading = true;

    this.timelineService.getTimelineEvents(
      this.engagementLetterId,
      this.ascending,
      this.typeFilter || undefined,
      this.statusFilter || undefined
    ).subscribe({
      next: (data) => {
        this.events = data;


        this.events.sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );

        this.loading = false;
      },
      error: () => {
        this.events = [];
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadTimeline();
  }

  clearFilters(): void {
    this.typeFilter = '';
    this.statusFilter = '';
    this.loadTimeline();
  }


}
