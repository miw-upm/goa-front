import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InquiryCreationDialogComponent} from './inquiry-creation-dialog.component';

describe('InquiryCreationDialogComponent', () => {
    let component: InquiryCreationDialogComponent;
    let fixture: ComponentFixture<InquiryCreationDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InquiryCreationDialogComponent, NoopAnimationsModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: null}
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(InquiryCreationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});