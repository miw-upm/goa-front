import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InquiryReplyDialogComponent} from './inquiry-reply-dialog.component';
import {InquiryState} from '../models/inquiry-state.enum';
import {InquiryCategory} from '../models/inquiry-category.enum';

describe('InquiryReplyDialogComponent', () => {
    let component: InquiryReplyDialogComponent;
    let fixture: ComponentFixture<InquiryReplyDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InquiryReplyDialogComponent, NoopAnimationsModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {provide: MatDialogRef, useValue: {}},
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        id: '1',
                        customerMobile: '666111222',
                        subject: 'Test',
                        description: 'Test desc',
                        category: InquiryCategory.OTHER,
                        state: InquiryState.OPEN
                    }
                }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(InquiryReplyDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});