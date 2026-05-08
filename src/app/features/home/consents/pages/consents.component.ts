import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {TitleComponent} from '@shared/ui/title/title.component';
import {ConsentSearch} from '../consent-search.model';
import {ConsentService} from '../consent.service';
import {Consent} from "../consent.model";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent, TitleComponent],
    templateUrl: 'consents.component.html'
})
export class ConsentsComponent {
    criteria: ConsentSearch;
    title = "Consentimientos LOPD";
    consents = of([]);
    consent: Observable<any>;

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
        this.consent = this.consentService.read(consent.id!);
    }
}
