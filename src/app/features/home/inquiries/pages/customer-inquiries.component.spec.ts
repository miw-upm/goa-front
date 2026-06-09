import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CustomerInquiriesComponent} from './customer-inquiries.component';

describe('CustomerInquiriesComponent', () => {
    let component: CustomerInquiriesComponent;
    let fixture: ComponentFixture<CustomerInquiriesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomerInquiriesComponent, NoopAnimationsModule],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();
        fixture = TestBed.createComponent(CustomerInquiriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});