import { Component, Input, signal, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommentsService, Comment } from '../../core/services/comments.services';
import { ToastService } from '../../core/services/toast.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, OnChanges {
  private commentsService = inject(CommentsService);
  private toast = inject(ToastService);

  @Input() itemId!: string;
  @Input() itemType!: 'notice' | 'event';
  @Input() placeholder: string = 'Share your thoughts...';

  comments = signal<Comment[]>([]);
  commentsLoading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  newCommentText = signal<string>('');
  errMsg = signal<string>('');

  ngOnInit() { this.loadComments(); }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['itemId'] && !changes['itemId'].firstChange) {
      this.loadComments();
    }
  }

  loadComments() {
    if (this.itemId) {
      this.commentsLoading.set(true);
      this.commentsService.getComments(this.itemId, this.itemType).subscribe({
        next: (response) => {
          const sorted = response.data.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.comments.set(sorted);
          this.commentsLoading.set(false);
        },
        error: (err) => {
          const msg = err.error?.message || 'Failed to load comments';
          this.errMsg.set(msg);
          this.commentsLoading.set(false);
        }
      });
    }
  }

  onSubmitComment() {
    const text = this.newCommentText().trim();
    if (!this.itemId || !text || this.submitting()) return;

    this.submitting.set(true);
    this.commentsService.addComment(this.itemId, this.itemType, text).subscribe({
      next: (response) => {
        this.comments.update(prev => [response.data, ...prev]);
        this.newCommentText.set('');
        this.errMsg.set('');
        this.submitting.set(false);
        this.toast.success('Comment added!');
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to add comment';
        this.errMsg.set(msg);
        this.toast.error(msg);
        this.submitting.set(false);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}

