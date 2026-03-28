import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-filter-date',
  template: `
    <div class="filter-container">
      <mat-form-field appearance="fill">
        <mat-label>{{ title }}</mat-label>
        <input matInput [matDatepicker]="pickerFrom" [(ngModel)]="date" (dateChange)="onDateChange()">
        <mat-datepicker-toggle matSuffix [for]="pickerFrom"></mat-datepicker-toggle>
        <mat-datepicker #pickerFrom></mat-datepicker>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .filter-container {
      display: flex;
      gap: 16px;
      align-items: center;
    }
  `],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class FilterDateComponent {
  @Input() title: string = 'Fecha';
  @Input() date: string | undefined;

  @Output() dateChange = new EventEmitter<string>();

  onDateChange(): void {
    this.dateChange.emit(this.date);
  }
}

