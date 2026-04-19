import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {MatIconModule} from '@angular/material/icon';
import {finalize, switchMap} from 'rxjs/operators';

import {CommentService} from '../comments/comment.service';
import {Comment} from '../comments/comment.model';

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
        CommonModule,
        ReactiveFormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule
    ]
})
export class EventCommentsComponent {

    readonly commentControl = new FormControl('', {nonNullable: true, validators: [Validators.required]});

    readonly eventId: string;
    readonly eventTitle?: string;

    comments: Comment[] = [];

    loading = false;
    submitting = false;
    deletingKey: string | null = null;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: EventCommentsDialogData,
        private readonly commentService: CommentService
    ) {
        this.eventId = data.eventId;
        this.eventTitle = data.eventTitle;

        this.loadComments();
    }

    loadComments(): void {
        this.loading = true;
        this.commentService.getCommentsByEvent(this.eventId)
            .pipe(finalize(() => this.loading = false))
            .subscribe(comments => {
                this.comments = this.mapComments(comments);
            });
    }


    addComment(): void {
        if (this.commentControl.invalid || this.submitting) return;

        const content = this.commentControl.value.trim();

        this.submitting = true;
        this.loading = true;

        this.commentService.createComment(this.eventId, content)
            .pipe(
                switchMap(() => this.commentService.getCommentsByEvent(this.eventId)),
                finalize(() => {
                    this.submitting = false;
                    this.loading = false;
                })
            )
            .subscribe(comments => {
                this.comments = this.mapComments(comments);
                this.commentControl.reset('');
            });
    }


 deleteComment(comment: Comment): void {

     const key = this.getDeleteKey(comment);

     if (this.deletingKey) return;

     this.deletingKey = key;
     this.loading = true;

     this.commentService.deleteComment(this.eventId, comment)
         .pipe(
             switchMap(() => this.commentService.getCommentsByEvent(this.eventId)),
             finalize(() => {
                 this.deletingKey = null;
                 this.loading = false;
             })
         )
         .subscribe(comments => {
             this.comments = this.mapComments(comments);
         });
 }



    getDeleteKey(comment: Comment): string {
        return `${comment.authorId}|${comment.content}|${comment.createdDate}`;
    }

    private mapComments(comments: Comment[]): Comment[] {
        return comments.map(c => ({
            content: c.content,
            createdDate: c.createdDate,
            authorId: c.authorId
        }));
    }
}
