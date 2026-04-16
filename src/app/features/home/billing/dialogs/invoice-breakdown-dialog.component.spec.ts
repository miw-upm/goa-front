import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';
import {InvoiceBreakdownDialogComponent} from './invoice-breakdown-dialog.component';

describe('InvoiceBreakdownDialogComponent', () => {
    let component: InvoiceBreakdownDialogComponent;
    let fixture: ComponentFixture<InvoiceBreakdownDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InvoiceBreakdownDialogComponent],
            providers: [
                {provide: MatDialogRef, useValue: {}},
                {
                    provide: MAT_DIALOG_DATA, useValue: {
                        taxableBase: 100,
                        vatAmount: 21,
                        totalAmount: 121,
                        incomes: [],
                        expenses: []
                    }
                }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InvoiceBreakdownDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

