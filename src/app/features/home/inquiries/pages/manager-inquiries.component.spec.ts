import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ManagerInquiriesComponent} from './manager-inquiries.component';

describe('ManagerInquiriesComponent', () => {
    let component: ManagerInquiriesComponent;
    let fixture: ComponentFixture<ManagerInquiriesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ManagerInquiriesComponent, NoopAnimationsModule],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();
        fixture = TestBed.createComponent(ManagerInquiriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});