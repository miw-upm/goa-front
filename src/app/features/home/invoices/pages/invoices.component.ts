import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {AuthService} from '@core/auth/auth.service';
import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterDateComponent} from '@shared/ui/inputs/filters/filter-date.component';
import {FilterInputComponent} from '@shared/ui/inputs/filters/filter-input.component';
import {TitleComponent} from '@shared/ui/title/title.component';
import {CancelYesDialogComponent} from '@shared/ui/dialogs/cancel-yes-dialog.component';
import {InvoiceCreationUpdatingDialogComponent} from '../dialogs/invoice-creation-updating-dialog.component';
import {InvoiceService} from '../invoice.service';
import {InvoiceFindCriteria} from '../models/invoice-find-criteria.model';
import {Invoice} from '../models/invoice.model';
import {INVOICES_COLUMNS} from './invoices-columns.config';
import {map} from "rxjs/operators";

@Component({
    standalone: true,
    imports: [FilterDateComponent, FilterInputComponent, TitleComponent, CrudComponent],
    templateUrl: 'invoices.component.html'
})
export class InvoicesComponent {
    deleteVisibility = false;
    invoices = of([] as Invoice[]);
    invoice: Observable<Invoice>;
    criteria: InvoiceFindCriteria = {};
    columns = INVOICES_COLUMNS;

    constructor(
        private readonly dialog: MatDialog,
        private readonly invoiceService: InvoiceService,
        auth: AuthService
    ) {
        this.deleteVisibility = auth.isAdmin();
    }

    search(): void {
        this.invoices = this.invoiceService.search({
            ...this.criteria,
            fromDate: this.formatDateValue(this.criteria.fromDate)
        }).pipe(
            map(invoices => invoices.map(invoice => ({
                ...invoice,
                issued: invoice.emissionDate != null
            })))
        );
    }

    create(): void {
        this.dialog.open(InvoiceCreationUpdatingDialogComponent, {width: '720px'})
            .afterClosed()
            .subscribe(() => this.search());
    }

    read(invoice: Invoice): void {
        if (invoice.id) {
            this.invoice = this.invoiceService.read(invoice.id);
        }
    }

    update(invoice: Invoice): void {
        if (invoice.emissionDate) {
            this.confirmIssuedInvoice('editar', () => this.executeUpdate(invoice));
            return;
        }
        this.executeUpdate(invoice);
    }

    private executeUpdate(invoice: Invoice): void {
        this.dialog.open(InvoiceCreationUpdatingDialogComponent, {width: '720px', data: invoice})
            .afterClosed()
            .subscribe(() => this.search());
    }

    delete(invoice: Invoice): void {
        if (invoice.emissionDate) {
            this.confirmIssuedInvoice('eliminar', () => this.executeDelete(invoice));
            return;
        }
        this.executeDelete(invoice);
    }

    private executeDelete(invoice: Invoice): void {
        if (invoice.id) {
            this.invoiceService.delete(invoice.id).subscribe(() => this.search());
        }
    }

    print(_invoice: Invoice): void {
    }

    run(invoice: Invoice): void {
        if (invoice.emissionDate) {
            this.confirmIssuedInvoice('ejecutar', () => this.executeRun(invoice));
            return;
        }
        this.executeRun(invoice);
    }

    private formatDateValue(value: Date | string | undefined): string | undefined {
        if (!value) {
            return undefined;
        }
        if (typeof value === 'string') {
            return value;
        }
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private executeRun(_invoice: Invoice): void {
        // Pendiente de implementar la emision de la factura.
    }

    private confirmIssuedInvoice(action: string, onConfirmed: () => void): void {
        this.dialog.open(CancelYesDialogComponent, {
            data: {
                title: 'Factura ya emitida',
                message: `Esta factura ya ha sido emitida. Continuar para ${action} puede afectar a un documento fiscal.`
            }
        }).afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                onConfirmed();
            }
        });
    }
}
