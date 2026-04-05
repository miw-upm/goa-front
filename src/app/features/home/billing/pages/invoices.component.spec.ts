import {ComponentFixture, TestBed} from '@angular/core/testing';
import {InvoicesComponent} from './invoices.component';
import {InvoiceService} from '../invoice.service';
import {of, throwError} from 'rxjs';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {InvoiceCreationDialogComponent} from '../dialogs/invoice-creation-dialog.component';
import {Invoice} from '../models/invoice.model';

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;
  let invoiceServiceSpy: jasmine.SpyObj<InvoiceService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    invoiceServiceSpy = jasmine.createSpyObj('InvoiceService', ['search', 'read']);
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

  it('should emit invoices sorted by date descending', (done) => {
    const payload: Invoice[] = [
      {
        id: 'inv-1',
        engagementId: 'eng-1',
        date: '2026-03-20',
        expenses: [],
        incomes: []
      },
      {
        id: 'inv-2',
        engagementId: 'eng-1',
        date: '2026-03-22',
        expenses: [],
        incomes: []
      },
      {
        id: 'inv-3',
        engagementId: 'eng-1',
        date: '2026-03-21',
        expenses: [],
        incomes: []
      }
    ];
    invoiceServiceSpy.search.and.returnValue(of(payload));

    component.search();

    component.invoices.subscribe(items => {
      expect(items.map(item => item.id)).toEqual(['inv-2', 'inv-3', 'inv-1']);
      done();
    });
  });

  it('should emit empty list when search fails', (done) => {
    invoiceServiceSpy.search.and.returnValue(throwError(() => new Error('backend error')));

    component.search();

    component.invoices.subscribe(items => {
      expect(items).toEqual([]);
      done();
    });
  });

  it('should emit service search results', (done) => {
    const payload: Invoice[] = [
      {
        id: 'inv-1',
        engagementId: 'eng-1',
        date: '2026-03-22',
        expenses: [{id: 'exp-1'}],
        incomes: [{id: 'inc-1'}]
      }
    ];
    invoiceServiceSpy.search.and.returnValue(of(payload));

    component.search();

    component.invoices.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].id).toBe('inv-1');
      expect(items[0].expenses).toEqual([{id: 'exp-1'}]);
      expect(items[0].incomes).toEqual([{id: 'inc-1'}]);
      done();
    });
  });

  it('should open invoice creation dialog and refresh data after close', () => {
    invoiceServiceSpy.search.and.returnValue(of([]));

    component.create();

    expect(dialogSpy.open).toHaveBeenCalledWith(InvoiceCreationDialogComponent, { width: '600px' });
    expect(invoiceServiceSpy.search).toHaveBeenCalledWith({});
  });

  it('should open invoice update dialog with selected invoice and refresh data after close', () => {
    const selectedInvoice: Invoice = {
      id: 'inv-1',
      engagementId: 'eng-1',
      date: '2026-03-22',
      expenses: [{id: 'exp-1'}],
      incomes: [{id: 'inc-1'}]
    };
    invoiceServiceSpy.search.and.returnValue(of([]));

    component.update(selectedInvoice);

    expect(dialogSpy.open).toHaveBeenCalledWith(InvoiceCreationDialogComponent, {
      width: '600px',
      data: selectedInvoice
    });
    expect(invoiceServiceSpy.search).toHaveBeenCalledWith({});
  });

  it('should not open invoice update dialog when invoice has no id', () => {
    component.update({
      id: undefined as any,
      engagementId: 'eng-1',
      date: '2026-03-22',
      expenses: [],
      incomes: []
    });

    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  it('should read selected invoice and expose details stream', (done) => {
    const selectedInvoice: Invoice = {
      id: 'inv-1',
      engagementId: 'eng-1',
      date: '2026-03-22',
      expenses: [],
      incomes: []
    };
    const detailedInvoice: Invoice = {
      ...selectedInvoice,
      expenses: [{id: 'exp-1', amount: 10}],
      incomes: [{id: 'inc-1', amount: 20}]
    };
    invoiceServiceSpy.read.and.returnValue(of(detailedInvoice));

    component.read(selectedInvoice);

    expect(invoiceServiceSpy.read).toHaveBeenCalledWith('inv-1');
    component.invoice.subscribe(invoice => {
      expect(invoice).toEqual(detailedInvoice);
      done();
    });
  });
});
