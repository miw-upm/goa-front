import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {CustomerInquiryService} from './customer-inquiry.service';

describe('CustomerInquiryService', () => {
    let service: CustomerInquiryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(CustomerInquiryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});