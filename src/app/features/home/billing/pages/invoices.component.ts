import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {catchError, map, Observable, of} from 'rxjs';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterDateComponent} from '@shared/ui/inputs/filter-date.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {InvoiceService} from '../invoice.service';
import {Invoice} from '../models/invoice.model';
import {InvoiceSearch} from '../models/invoice-search.model';
import {InvoiceCreationDialogComponent} from '../dialogs/invoice-creation-dialog.component';
import {InvoiceBreakdownDialogComponent} from "../dialogs/invoice-breakdown-dialog.component";

@Component({
    standalone: true,
    selector: 'app-invoices',
    imports: [FormsModule, CrudComponent, FilterDateComponent, FilterInputComponent],
    templateUrl: 'invoices.component.html'
})
export class InvoicesComponent {
    title = 'Facturas';
    invoices = of([] as Invoice[]);
    invoice: Observable<Invoice>;
    criteria: InvoiceSearch = {};

    constructor(
        private readonly dialog: MatDialog,
        private readonly invoiceService: InvoiceService
    ) {}

    create(): void {
        this.dialog.open(InvoiceCreationDialogComponent, {width: '600px'})
            .afterClosed()
            .subscribe(() => this.search());
    }

    update(invoice: Invoice): void {
        if (!invoice.id) {
            return;
        }

        this.dialog.open(InvoiceCreationDialogComponent, {
            width: '600px',
            data: invoice
        }).afterClosed()
            .subscribe(() => this.search());
    }

    search(): void {
        const criteria = this.normalizeCriteria();

        this.invoices = this.invoiceService.search(criteria)
            .pipe(
                map(invoices => [...invoices].sort((a, b) => b.date.localeCompare(a.date))),
                catchError(() => of([] as Invoice[]))
            );
    }

    read(invoice: Invoice): void {
        this.invoice = this.invoiceService.read(invoice.id);
    }

    showBreakdown(invoice: Invoice): void {
        this.invoiceService.readBreakdown(invoice.id).subscribe(breakdown => {
            this.dialog.open(InvoiceBreakdownDialogComponent, {
                width: '1000px',
                maxWidth: 'none',
                data: breakdown
            });
        });
    }

    private normalizeCriteria(): InvoiceSearch {
        const normalizedCriteria: InvoiceSearch = {};

        if (this.criteria.engagementId) {
            normalizedCriteria.engagementId = this.criteria.engagementId;
        }

        if (!this.criteria.date) {
            return normalizedCriteria;
        }

        const date = new Date(this.criteria.date);
        if (Number.isNaN(date.getTime())) {
            throw new TypeError('La fecha no es válida.');
        }

        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        return {
            ...normalizedCriteria,
            date: `${year}-${month}-${day}`
        };
    }
}
