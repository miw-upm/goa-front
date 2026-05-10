import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';

import {FilterInputComponent} from '../../../../shared/ui/inputs/filters/filter-input.component';
import {TitleComponent} from '@shared/ui/title/title.component';
import {ConsentSearch} from '../consent-search.model';
import {ConsentService} from '../consent.service';
import {Consent} from "../consent.model";
import {CONSENTS_COLUMNS} from "./consents-columns.config";
import {CrudComponent} from "@shared/ui/crud/crud.component";

@Component({
    standalone: true,
    imports: [FormsModule, FilterInputComponent, TitleComponent, CrudComponent],
    templateUrl: 'consents.component.html'
})
export class ConsentsComponent {
    criteria: ConsentSearch;
    consents = of([]);
    consent: Observable<any>;
    columns = CONSENTS_COLUMNS;

    constructor(private readonly consentService: ConsentService) {
        this.resetSearch();
    }

    search(): void {
        this.consents = this.consentService.search(this.criteria);
    }

    resetSearch(): void {
        this.criteria = {};
    }

    read(consent: Consent): void {
        this.consent = this.consentService.read(consent.id);
    }
}
