import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@common/components/inputs/search.component';
import {SharedUserService} from "../services/shared-user.service";
import {User} from "@shared/models/user.model";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-user',
    templateUrl: './search-by-user.component.html'
})
export class SearchByUserComponent {
    users: Observable<User[]> = of([]);

    @Input() user: User;
    @Output() userChange = new EventEmitter<User>();

    constructor(private readonly sharedUserService: SharedUserService) {
    }

    public onSelect(user:User): void {
        this.userChange.emit(user);
    }

    searchByUser(filter:string): void {
        this.users = this.sharedUserService.searchUsers(filter);
    }
}
