import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InquiryDetailDialogComponent} from './inquiry-detail-dialog.component';
import {InquiryState} from '../models/inquiry-state.enum';
import {InquiryCategory} from '../models/inquiry-category.enum';

describe('InquiryDetailDialogComponent', () => {
    let component: InquiryDetailDialogComponent;
    let fixture: ComponentFixture<InquiryDetailDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InquiryDetailDialogComponent, NoopAnimationsModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {provide: MatDialogRef, useValue: {}},
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        id: '1',
                        subject: 'Test',
                        description: 'Test desc',
                        category: InquiryCategory.OTHER,
                        state: InquiryState.OPEN
                    }
                }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(InquiryDetailDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});