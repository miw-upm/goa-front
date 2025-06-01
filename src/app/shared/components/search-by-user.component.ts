import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from 'rxjs';

import {SearchComponent} from '@common/components/inputs/search.component';
import {SharedUserService} from "../services/shared-user.service";

@Component({
    standalone: true,
    imports: [SearchComponent],
    selector: 'app-search-by-user',
    templateUrl: './search-by-user.component.html'
})
export class SearchByUserComponent {
    users: Observable<string[]> = of([]);

    @Input() user: string;
    @Output() userChange = new EventEmitter<string>();

    constructor(private readonly sharedUserService: SharedUserService) {
    }

    public onSelect(): void {
        this.userChange.emit(this.user?.split(':')[0] ?? '');
    }

    searchByUser(): void {
        this.users = this.sharedUserService.searchUsers(this.user);
    }
}
