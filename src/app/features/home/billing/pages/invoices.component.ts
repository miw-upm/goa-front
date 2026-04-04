import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {catchError, map, Observable, of} from 'rxjs';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {InvoiceService} from '../invoice.service';
import {Invoice} from '../models/invoice.model';
import {InvoiceCreationDialogComponent} from '../dialogs/invoice-creation-dialog.component';

@Component({
    standalone: true,
    selector: 'app-invoices',
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'invoices.component.html'
})
export class InvoicesComponent {
    title = 'Facturas';
    invoices = of([] as Invoice[]);
    invoice: Observable<Invoice>;
    criteria: { engagementId?: string } = {};

    constructor(
        private readonly dialog: MatDialog,
        private readonly invoiceService: InvoiceService
    ) {}

    create(): void {
        this.dialog.open(InvoiceCreationDialogComponent, {width: '600px'})
            .afterClosed()
            .subscribe(() => this.search());
    }

    search(): void {
        this.invoices = this.invoiceService.search(this.criteria)
            .pipe(
                map(invoices => [...invoices].sort((a, b) => b.date.localeCompare(a.date))),
                catchError(() => of([] as Invoice[]))
            );
    }

    read(invoice: Invoice): void {
        this.invoice = this.invoiceService.read(invoice.id);
    }
}
