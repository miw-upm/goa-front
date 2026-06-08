import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';

import {AuthService} from "@core/auth/auth.service";
import {ClipboardToastDialogComponent} from "@shared/ui/dialogs/clipboard-toast-dialog.component";
import {WarningDialogComponent} from "@shared/ui/dialogs/warning-dialog.component";
import {CrudComponent} from "@shared/ui/crud/crud.component";
import {FilterInputComponent} from "@shared/ui/inputs/filters/filter-input.component";
import {TitleComponent} from "@shared/ui/title/title.component";
import {User} from "@features/shared/models/user.model";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";

import {UserCreationUpdatingDialogComponent} from '../dialogs/user-creation-updating-dialog.component';
import {UserFindCriteria} from '../user-find-criteria.model';
import {UserService} from '../user.service';
import {USERS_COLUMNS} from './users-columns.config';

@Component({
    standalone: true,
    imports: [FormsModule, CrudComponent, FilterInputComponent, TitleComponent, MatButtonToggle, MatButtonToggleGroup],
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
        this.criteria = {
            active: true,
            billable: null
        };
    }

    create(): void {
        this.dialog
            .open(UserCreationUpdatingDialogComponent)
            .afterClosed()
            .subscribe((mobile: string | undefined) => {
                if (mobile) {
                    this.criteria.customer = mobile;
                    this.search();
                }
            });
    }

    read(user: User): void {
        this.user = this.userService.read(user.id!);
    }

    update(user: User): void {
        this.userService
            .read(user.id!)
            .subscribe(fullUser => this.dialog.open(UserCreationUpdatingDialogComponent, {data: fullUser})
                .afterClosed()
                .subscribe((mobile: string | undefined) => {
                    if (mobile) {
                        this.criteria.customer = mobile;
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
