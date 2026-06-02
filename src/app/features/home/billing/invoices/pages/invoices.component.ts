import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';

import {InvoiceCreationDialogComponent} from '../dialogs/invoice-creation-dialog.component';
import {InvoiceFromEngagementDialogComponent} from '../dialogs/invoice-from-engagement-dialog.component';
import {InvoiceRectificationDialogComponent} from '../dialogs/invoice-rectification-dialog.component';
import {InvoiceUpdatingDialogComponent} from '../dialogs/invoice-updating-dialog.component';
import {
    InvoiceCreationSource,
    SelectInvoiceCreationSourceDialogComponent
} from '../dialogs/select-invoice-creation-source-dialog.component';
import {InvoiceService} from '../invoice.service';
import {InvoiceFindCriteria} from '../models/invoice-find-criteria.model';
import {Invoice} from '../models/invoice.model';
import {INVOICES_COLUMNS} from './invoices-columns.config';
import {map} from "rxjs/operators";
import {FilterDateComponent} from "@shared/ui/inputs/filters/filter-date.component";
import {FilterInputComponent} from "@shared/ui/inputs/filters/filter-input.component";
import {TitleComponent} from "@shared/ui/title/title.component";
import {CrudComponent} from "@shared/ui/crud/crud.component";
import {WarningDialogComponent} from "@shared/ui/dialogs/warning-dialog.component";
import {AuthService} from "@core/auth/auth.service";

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
        this.dialog.open(SelectInvoiceCreationSourceDialogComponent, {width: '460px'})
            .afterClosed()
            .subscribe((source?: InvoiceCreationSource) => this.openCreationDialog(source));
    }

    read(invoice: Invoice): void {
        if (invoice.id) {
            this.invoice = this.invoiceService.read(invoice.id);
        }
    }

    update(invoice: Invoice): void {
        if (invoice.emissionDate) {
            this.warnIssuedInvoice();
            return;
        }
        this.executeUpdate(invoice);
    }

    delete(invoice: Invoice): void {
        this.executeDelete(invoice);
    }

    print(invoice: Invoice): void {
        if (invoice.id) {
            this.invoiceService.print(invoice.id).subscribe();
        }
    }

    run(invoice: Invoice): void {
        if (invoice.emissionDate) {
            this.warnIssuedInvoice();
            return;
        }
        this.executeRun(invoice);
    }

    private executeUpdate(invoice: Invoice): void {
        if (!invoice.id) {
            return;
        }
        this.invoiceService.read(invoice.id).subscribe(fullInvoice => {
            if (fullInvoice.engagement) {
                this.warnEngagementInvoiceUpdate();
            } else {
                this.dialog.open(InvoiceUpdatingDialogComponent, {width: '720px', data: fullInvoice})
                    .afterClosed()
                    .subscribe((reference?: string) => this.setEngagementReferenceAndSearch(reference));
            }
        });
    }

    private executeDelete(invoice: Invoice): void {
        if (invoice.id) {
            this.invoiceService.delete(invoice.id).subscribe(() => this.search());
        }
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
        if (_invoice.id) {
            this.invoiceService.emission(_invoice.id).subscribe(() => {
                this.setEngagementReferenceAndSearch(_invoice.engagement?.id?.substring(0, 4));
            });
        }
    }

    private warnIssuedInvoice(): void {
        this.dialog.open(WarningDialogComponent, {
            data: {
                title: 'Factura emitida',
                message: 'Esta factura ya ha sido emitida y no puede modificarse ni volver a emitirse.'
            }
        });
    }

    private warnEngagementInvoiceUpdate(): void {
        this.dialog.open(WarningDialogComponent, {
            data: {
                title: 'Factura con hoja de encargo',
                message: 'Modificar una factura suelta asociada a una Hoja de Encargo puede crear inconsistencias.' +
                    ' Es mejor eliminar todas las facturas proformas y volver a crearlas desde la hoja de encargo.'
            }
        });
    }

    private openCreationDialog(source?: InvoiceCreationSource): void {
        if (source === 'manual') {
            this.dialog.open(InvoiceCreationDialogComponent, {width: '720px'})
                .afterClosed()
                .subscribe((reference?: string) => this.setEngagementReferenceAndSearch(reference));
        }
        if (source === 'engagement') {
            this.dialog.open(InvoiceFromEngagementDialogComponent, {width: '720px'})
                .afterClosed()
                .subscribe((reference?: string) => this.setEngagementReferenceAndSearch(reference));
        }
        if (source === 'rectification') {
            this.dialog.open(InvoiceRectificationDialogComponent, {width: '720px'})
                .afterClosed()
                .subscribe(result => {
                    if (result) {
                        this.search();
                    }
                });
        }
    }

    private setEngagementReferenceAndSearch(reference: string | undefined): void {
        this.criteria.client = undefined;
        this.criteria.engagementReference = reference;
        this.search();
    }
}
