import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {of} from 'rxjs';

import {ReadDetailDialogComponent} from '@common/dialogs/read-detail.dialog.component';
import {CrudComponent} from '@common/components/crud.component';
import {FilterInputComponent} from "@common/components/filter-input.component";
import {UserCreationUpdatingDialogComponent} from './user-creation-updating-dialog.component';
import {UserSearch} from './user-search.model';
import {UserService} from "./user.service";
import {User} from "../../shared/user.model";

@Component({
    standalone: true,
    imports: [MatCard, MatCardContent, FormsModule, MatIcon, CrudComponent, MatCardTitle, FilterInputComponent,
        MatButton],
    templateUrl: 'users.component.html'
})
export class UsersComponent {
    userSearch: UserSearch;
    title = 'Users management';
    users = of([]);

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
        this.dialog.open(ReadDetailDialogComponent, {
            data: {
                title: 'User Details',
                object: this.userService.read(user.mobile)
            }
        });
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
