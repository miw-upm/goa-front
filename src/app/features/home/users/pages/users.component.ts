import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';
import {CrudComponent} from '@common/components/crud/crud.component';
import {FilterInputComponent} from "@common/components/inputs/filter-input.component";
import {UserCreationUpdatingDialogComponent} from '../components/user-creation-updating-dialog.component';
import {UserSearch} from './user-search.model';
import {UserService} from "../user.service";
import {User} from "@shared/models/user.model";

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'users.component.html'
})
export class UsersComponent {
    userSearch: UserSearch;
    title = "Users";
    users = of([]);
    user: Observable<any>;

    constructor(private readonly dialog: MatDialog, private readonly userService: UserService) {
        this.resetSearch();
    }

    search(): void {
        this.users = this.userService.search(this.userSearch);
    }

    resetSearch(): void {
        this.userSearch = {};
    }

    create(): void {
        this.dialog
            .open(UserCreationUpdatingDialogComponent);
    }

    read(user: User): void {
        this.user = this.userService.read(user.mobile)
    }

    update(user: User): void {
        this.userService
            .read(user.mobile)
            .subscribe(fullUser => this.dialog.open(UserCreationUpdatingDialogComponent, {data: fullUser})
                .afterClosed()
                .subscribe(() => this.search())
            );
    }

}
