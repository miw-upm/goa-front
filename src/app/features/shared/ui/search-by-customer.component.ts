import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@shared/ui/inputs/filters/search.component';
import {SharedUserService} from "../services/shared-user.service";
import {User} from "../models/user.model";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-customer',
    templateUrl: './search-by-customer.component.html'
})
export class SearchByCustomerComponent {
    users: Observable<User[]> = of([]);

    @Input() user: User;
    @Input() title: string = 'Search by User';
    @Output() userChange = new EventEmitter<User>();

    constructor(private readonly sharedUserService: SharedUserService) {
    }

    public onSelect(user: User): void {
        this.userChange.emit(user);
    }

    searchByUser(filter: string): void {
        this.users = this.sharedUserService.searchCustomers(filter);
    }
}
