import {ComponentFixture, TestBed} from '@angular/core/testing';
import {InvoicesComponent} from './invoices.component';
import {InvoiceService} from '../invoice.service';
import {of} from 'rxjs';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {FormsModule} from '@angular/forms';

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;
  let invoiceServiceSpy: jasmine.SpyObj<InvoiceService>;

  beforeEach(async () => {
    invoiceServiceSpy = jasmine.createSpyObj('InvoiceService', ['search']);
    await TestBed.configureTestingModule({
      imports: [InvoicesComponent, CrudComponent, FilterInputComponent, FormsModule],
      providers: [
        { provide: InvoiceService, useValue: invoiceServiceSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(InvoicesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call invoiceService.search with criteria', () => {
    invoiceServiceSpy.search.and.returnValue(of([]));
    component.criteria.engagementId = 'test-id';
    component.search();
    expect(invoiceServiceSpy.search).toHaveBeenCalledWith({ engagementId: 'test-id' });
  });
});
