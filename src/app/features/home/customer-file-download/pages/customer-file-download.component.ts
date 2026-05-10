import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';

import {CustomerFileDownloadService} from '../customer-file-download.service';
import {FilterInputComponent} from '@shared/ui/inputs/filters/filter-input.component';
import {CustomerFileDownloadFindCriteria} from "../customer-file-download-find-criteria.model";
import {CustomerFileDownload} from "../customer-file-download.model";
import {CrudComponent} from "@shared/ui/crud/crud.component";
import {TitleComponent} from "@shared/ui/title/title.component";
import {CUSTOMER_FILE_DOWNLOAD_COLUMNS} from "./customer-file-download-columns.config";

@Component({
    standalone: true,
    providers: [CustomerFileDownloadService],
    imports: [FormsModule, FilterInputComponent, CrudComponent, TitleComponent],
    templateUrl: 'customer-file-download.component.html'
})
export class CustomerFileDownloadComponent {
    criteria: CustomerFileDownloadFindCriteria;
    columns = CUSTOMER_FILE_DOWNLOAD_COLUMNS;

    customerFileDownloads: Observable<CustomerFileDownload[]> = of([]);
    customerFileDownload: Observable<any>;

    constructor(private readonly customerFileDownloadService: CustomerFileDownloadService) {
        this.resetSearch();
    }

    resetSearch(): void {
        this.criteria = {customer: undefined, documentType: undefined};
    }

    search(): void {
        this.customerFileDownloads = this.customerFileDownloadService.search(this.criteria);
    }

    read(customerFileDownload: CustomerFileDownload): void {
        this.customerFileDownload = this.customerFileDownloadService.read(customerFileDownload.id);
    }

}
