import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {catchError, map, of} from 'rxjs';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {InvoiceService} from '../invoice.service';
import {Invoice} from '../models/invoice.model';

@Component({
    standalone: true,
    selector: 'app-invoices',
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'invoices.component.html'
})
export class InvoicesComponent {
    title = 'Facturas';
    invoices = of([] as Invoice[]);
    criteria: { engagementId?: string } = {};

    constructor(private readonly invoiceService: InvoiceService) {}

    search(): void {
        this.invoices = this.invoiceService.search(this.criteria)
            .pipe(
                map(invoices => [...invoices].sort((a, b) => b.date.localeCompare(a.date))),
                catchError(() => of([] as Invoice[]))
            );
    }
}