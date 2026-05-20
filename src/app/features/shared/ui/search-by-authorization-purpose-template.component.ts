import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@shared/ui/inputs/filters/search.component';
import {
    AuthorizationPurposeTemplate
} from '../../home/authorization-purpose-templates/models/authorization-purpose-template.model';
import {SharedAuthorizationPurposeTemplateService} from '../services/shared-authorization-purpose-template.service';

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-authorization-purpose',
    templateUrl: './search-by-authorization-purpose-template.component.html'
})
export class SearchByAuthorizationPurposeTemplateComponent {
    purposes: Observable<AuthorizationPurposeTemplate[]> = of([]);

    @Input() purpose: AuthorizationPurposeTemplate;
    @Output() purposeChange = new EventEmitter<AuthorizationPurposeTemplate>();

    constructor(private readonly service: SharedAuthorizationPurposeTemplateService) {
    }

    public onSelect(value: AuthorizationPurposeTemplate): void {
        this.purposeChange.emit(value);
    }

    searchByPurpose(filter: string): void {
        this.purposes = this.service.searchPurposes(filter);
    }
}
