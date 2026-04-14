import {Component, Inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {finalize} from 'rxjs/operators';

import {CommentService} from '../comment.service';

interface EventCommentsDialogData {
    eventId: string;
    eventTitle?: string;
}

@Component({
    standalone: true,
    selector: 'app-event-comments',
    templateUrl: './event-comments.component.html',
    styleUrls: ['./event-comments.component.css'],
    imports: [
        ReactiveFormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class EventCommentsComponent {
    readonly commentControl = new FormControl('', {nonNullable: true, validators: [Validators.required]});
    readonly eventId: string;
    readonly eventTitle?: string;

    submitting = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: EventCommentsDialogData,
        private readonly commentService: CommentService
    ) {
        this.eventId = data.eventId;
        this.eventTitle = data.eventTitle;
    }

    addComment(): void {
        if (this.commentControl.invalid || this.submitting) {
            this.commentControl.markAsTouched();
            return;
        }

        const content = this.commentControl.value.trim();
        if (!content) {
            this.commentControl.setErrors({required: true});
            return;
        }

        this.submitting = true;
        this.commentService.createComment(this.eventId, content)
            .pipe(finalize(() => this.submitting = false))
            .subscribe({
                next: () => {
                    this.commentControl.reset('');
                }
            });
    }
}
