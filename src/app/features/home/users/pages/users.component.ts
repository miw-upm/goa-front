import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';

import {CrudComponent} from '@shared/ui/crud/crud.component';
import {FilterInputComponent} from "@shared/ui/inputs/filter-input.component";
import {User} from "../../../common/models/user.model";
import {UserCreationUpdatingDialogComponent} from '../dialogs/user-creation-updating-dialog.component';
import {UserSearch} from '../user-search.model';
import {UserService} from "../user.service";


@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent],
    templateUrl: 'users.component.html'
})
export class UsersComponent {
    criteria: UserSearch;
    title = "Users";
    users = of([]);
    user: Observable<any>;

    constructor(private readonly dialog: MatDialog, private readonly userService: UserService) {
        this.resetSearch();
    }

    search(): void {
        this.users = this.userService.search(this.criteria);
    }

    resetSearch(): void {
        this.criteria = {};
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
