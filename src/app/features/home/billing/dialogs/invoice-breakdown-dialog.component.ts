import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {InvoiceBreakdown} from '../models/invoice-breakdown.model';
import {MatButtonModule} from "@angular/material/button";

@Component({
    standalone: true,
    selector: 'app-invoice-breakdown-dialog',
    template: `
        <h2 mat-dialog-title>Desglose de Factura</h2>
        <mat-dialog-content>
            <mat-card class="mat-elevation-z4">
                <mat-card-header>
                    <mat-card-title>Ingresos</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <table mat-table [dataSource]="data.incomes" class="mat-elevation-z0">
                        <ng-container matColumnDef="id">
                            <th mat-header-cell *matHeaderCellDef>ID</th>
                            <td mat-cell *matCellDef="let element" class="id-cell">{{ element.id }}</td>
                        </ng-container>
                        <ng-container matColumnDef="taxableBase">
                            <th mat-header-cell *matHeaderCellDef>Base Imponible</th>
                            <td mat-cell *matCellDef="let element">{{ element.taxableBase | currency:'EUR' }}</td>
                        </ng-container>
                        <ng-container matColumnDef="vatAmount">
                            <th mat-header-cell *matHeaderCellDef>21% IVA</th>
                            <td mat-cell *matCellDef="let element">{{ element.vatAmount | currency:'EUR' }}</td>
                        </ng-container>
                        <ng-container matColumnDef="amountWithVat">
                            <th mat-header-cell *matHeaderCellDef>Total</th>
                            <td mat-cell *matCellDef="let element">{{ element.amountWithVat | currency:'EUR' }}</td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                    </table>
                </mat-card-content>
            </mat-card>

            <mat-card class="mat-elevation-z4">
                <mat-card-header>
                    <mat-card-title>Gastos</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <table mat-table [dataSource]="data.expenses" class="mat-elevation-z0">
                        <ng-container matColumnDef="id">
                            <th mat-header-cell *matHeaderCellDef>ID</th>
                            <td mat-cell *matCellDef="let element" class="id-cell">{{ element.id }}</td>
                        </ng-container>
                        <ng-container matColumnDef="taxableBase">
                            <th mat-header-cell *matHeaderCellDef>Base Imponible</th>
                            <td mat-cell *matCellDef="let element">{{ element.taxableBase | currency:'EUR' }}</td>
                        </ng-container>
                        <ng-container matColumnDef="vatAmount">
                            <th mat-header-cell *matHeaderCellDef>21% IVA</th>
                            <td mat-cell *matCellDef="let element">{{ element.vatAmount | currency:'EUR' }}</td>
                        </ng-container>
                        <ng-container matColumnDef="amountWithVat">
                            <th mat-header-cell *matHeaderCellDef>Total</th>
                            <td mat-cell *matCellDef="let element">{{ element.amountWithVat | currency:'EUR' }}</td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                    </table>
                </mat-card-content>
            </mat-card>

            <mat-list>
                <mat-list-item>
                    <span matListItemTitle>BASE IMPONIBLE</span>
                    <span matListItemLine>{{ data.taxableBase | currency:'EUR' }}</span>
                </mat-list-item>
                <mat-list-item>
                    <span matListItemTitle>21% IVA</span>
                    <span matListItemLine>{{ data.vatAmount | currency:'EUR' }}</span>
                </mat-list-item>
                <mat-list-item>
                    <span matListItemTitle><strong>TOTAL</strong></span>
                    <span matListItemLine><strong>{{ data.totalAmount | currency:'EUR' }}</strong></span>
                </mat-list-item>
            </mat-list>

        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cerrar</button>
        </mat-dialog-actions>
    `,
    styles: [`
        mat-card {
            margin-bottom: 20px;
        }

        th.mat-header-cell, td.mat-cell {
            white-space: nowrap;
            padding-right: 24px;
        }

        .id-cell {
            word-break: break-all;
        }

        mat-list-item span[matListItemTitle] {
            color: grey;
            font-size: 0.8em;
        }

        mat-list-item span[matListItemLine] {
            font-size: 1.2em;
            text-align: right;
            width: 100%;
        }

        table {
            width: 100%;
        }
    `],
    imports: [
        CommonModule,
        MatDialogModule,
        MatTableModule,
        MatCardModule,
        MatListModule,
        MatButtonModule
    ]
})
export class InvoiceBreakdownDialogComponent {
    displayedColumns: string[] = ['id', 'taxableBase', 'vatAmount', 'amountWithVat'];

    constructor(@Inject(MAT_DIALOG_DATA) public data: InvoiceBreakdown) {
    }
}
