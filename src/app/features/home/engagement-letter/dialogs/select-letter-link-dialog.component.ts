import {Component, Inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';
import {User} from '@features/shared/models/user.model';
import {MatButton} from '@angular/material/button';
import {FormSelectComponent} from '@shared/ui/inputs/forms/form-select.component';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-select-letter-link.dialog',
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        FormsModule,
        FormSelectComponent
    ],
    templateUrl: './select-letter-link-dialog.component.html'
})
export class SelectLetterLinkDialogComponent {

    userLabels$: Observable<string[]>;
    selectedUserLabel?: string;

    constructor(
        private readonly dialogRef: MatDialogRef<SelectLetterLinkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { users: User[] }
    ) {
        this.userLabels$ = of(
            this.data.users.map(user => this.userLabel(user))
        );
    }

    accept(): void {
        const selectedUser = this.data.users.find(user =>
            this.userLabel(user) === this.selectedUserLabel
        );

        this.dialogRef.close(selectedUser);
    }

    private userLabel(user: User): string {
        return [
            user.firstName,
            user.familyName,
            user.mobile
        ].filter(Boolean).join(' ');
    }
}
