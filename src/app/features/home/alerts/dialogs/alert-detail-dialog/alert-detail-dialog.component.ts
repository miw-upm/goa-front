import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button'; 
import { DatePipe } from '@angular/common'; 
import { AlertService } from '../../alert.service';
import { AlertDetail } from '../../models/alert.model';

@Component({
  selector: 'app-alert-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, 
    MatButtonModule, 
  ],
  providers: [DatePipe, AlertService],
  templateUrl: './alert-detail-dialog.component.html',
  styleUrls: ['./alert-detail-dialog.component.css'],
})
export class AlertDetailDialogComponent {
  alertDetail: AlertDetail;

  constructor(
    private readonly alertService: AlertService,
    private readonly dialogRef: MatDialogRef<AlertDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { alertId: string },
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.alertService.read(this.data.alertId).subscribe((alertDetail) => {
      this.alertDetail = alertDetail;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}