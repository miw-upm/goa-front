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
    <mat-form-field appearance="outline">
      <mat-label>{{ title }}</mat-label>
      <input matInput [matDatepicker]="pickerFrom" [(ngModel)]="date" (ngModelChange)="onDateChange()">
      <button
        (click)="clearDate()"
        [disabled]="!date"
        mat-icon-button
        matSuffix
        type="button"
        aria-label="Limpiar fecha"
      >
        <mat-icon>delete</mat-icon>
      </button>
      <mat-datepicker-toggle matSuffix [for]="pickerFrom"></mat-datepicker-toggle>
      <mat-datepicker #pickerFrom></mat-datepicker>
    </mat-form-field>
  `,
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
  @Input() date: Date | string | undefined;

  @Output() dateChange = new EventEmitter<Date | string | undefined>();

  onDateChange(): void {
    this.dateChange.emit(this.date);
  }

  clearDate(): void {
    this.date = undefined;
    this.dateChange.emit(this.date);
  }
}

