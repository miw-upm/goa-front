import {ComponentFixture, TestBed} from '@angular/core/testing';
import {InvoicesComponent} from './invoices.component';
import {InvoiceService} from '../invoice.service';
import {of} from 'rxjs';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {InvoiceCreationDialogComponent} from '../dialogs/invoice-creation-dialog.component';

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;
  let invoiceServiceSpy: jasmine.SpyObj<InvoiceService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    invoiceServiceSpy = jasmine.createSpyObj('InvoiceService', ['search']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(undefined)
    } as any);
    await TestBed.configureTestingModule({
      imports: [InvoicesComponent, CrudComponent, FilterInputComponent, FormsModule],
      providers: [
        { provide: InvoiceService, useValue: invoiceServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
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

  it('should open invoice creation dialog and refresh data after close', () => {
    invoiceServiceSpy.search.and.returnValue(of([]));

    component.create();

    expect(dialogSpy.open).toHaveBeenCalledWith(InvoiceCreationDialogComponent, { width: '600px' });
    expect(invoiceServiceSpy.search).toHaveBeenCalledWith({});
  });
});
