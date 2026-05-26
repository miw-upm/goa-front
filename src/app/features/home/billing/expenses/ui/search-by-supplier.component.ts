import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {ExpenseService} from '../expense.service';
import {SupplierInfo} from '../models/supplier-info.model';
import {SearchComponent} from "@shared/ui/inputs/filters/search.component";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-supplier',
    templateUrl: './search-by-supplier.component.html'
})
export class SearchBySupplierComponent {
    suppliers: Observable<SupplierInfo[]> = of([]);

    @Input() supplier: SupplierInfo;
    @Input() title = 'Buscar proveedor';
    @Output() supplierChange = new EventEmitter<SupplierInfo>();

    constructor(private readonly expenseService: ExpenseService) {
    }

    onSelect(supplier: SupplierInfo): void {
        this.supplierChange.emit(supplier);
    }

    search(filter: string): void {
        this.suppliers = this.expenseService.searchSuppliers(filter);
    }
}
