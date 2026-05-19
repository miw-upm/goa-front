import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@shared/ui/inputs/filters/search.component';
import {SharedUserService} from "../services/shared-user.service";
import {User} from "../models/user.model";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-staff',
    templateUrl: './search-by-staff.component.html'
})
export class SearchByStaffComponent {
    users: Observable<User[]> = of([]);

    @Input() user: User;
    @Input() title: string = 'Search by Staff';
    @Output() userChange = new EventEmitter<User>();

    constructor(private readonly sharedUserService: SharedUserService) {
    }

    public onSelect(user: User): void {
        this.userChange.emit(user);
    }

    searchByUser(filter: string): void {
        this.users = this.sharedUserService.searchStaffs(filter);
    }
}
