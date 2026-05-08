import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';

import {Crud2Component} from '@shared/ui/crud2/crud2.component';
import {FilterInputComponent} from '@shared/ui/inputs/filter-input.component';
import {USERS_COLUMNS} from './users-columns.config';
import {User} from '@features/shared/models/user.model';
import {UserCreationUpdatingDialogComponent} from '../dialogs/user-creation-updating-dialog.component';
import {UserFindCriteria} from '../user-find-criteria.model';
import {UserService} from '../user.service';
import {WarningDialogComponent} from "@shared/ui/dialogs/warning-dialog.component";
import {ClipboardToastDialogComponent} from "@shared/ui/dialogs/clipboard-toast-dialog.component";
import {AuthService} from "@core/auth/auth.service";

@Component({
    standalone: true,
    imports: [FormsModule, Crud2Component, FilterInputComponent],
    templateUrl: 'users.component.html'
})
export class UsersComponent {
    visible: boolean = true;
    criteria: UserFindCriteria;
    title = 'Usuarios';
    users = of([]);
    user: Observable<any>;

    columns = USERS_COLUMNS;

    constructor(private readonly dialog: MatDialog, private readonly userService: UserService, auth: AuthService) {
        this.visible = auth.isAdmin();
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
            .open(UserCreationUpdatingDialogComponent)
            .afterClosed()
            .subscribe((mobile: string | undefined) => {
                if (mobile) {
                    this.criteria.mobile = mobile;
                    this.search();
                }
            });
    }

    read(user: User): void {
        this.user = this.userService.read(user.mobile)
    }

    update(user: User): void {
        this.userService
            .read(user.mobile)
            .subscribe(fullUser => this.dialog.open(UserCreationUpdatingDialogComponent, {data: fullUser})
                .afterClosed()
                .subscribe((mobile: string | undefined) => {
                    if (mobile) {
                        this.criteria.mobile = mobile;
                        this.search();
                    }
                })
            );
    }

    link(user: User): void {
        this.userService.createAccessLink(user).subscribe({
            next: link => {
                navigator.clipboard.writeText(link);
                this.dialog.open(ClipboardToastDialogComponent, {
                    data: 'Access link created and copied'
                });
            },
            error: error => {
                this.dialog.open(WarningDialogComponent, {
                    data: {
                        title: 'Warning',
                        message: error.message
                    }
                });
            }
        });
    }

    json() {
        this.userService.searchAllJson()
            .subscribe();
    }
}
