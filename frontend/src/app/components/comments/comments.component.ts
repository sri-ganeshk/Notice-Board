import { Component, Input, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommentsService, Comment } from '../../core/services/comments.services';
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
  @Input() itemId!: string;
  @Input() itemType!: 'notice' | 'event';
  @Input() placeholder: string = 'Share your thoughts...';

  comments = signal<Comment[]>([]);
  commentsLoading = signal<boolean>(true);
  newCommentText = signal<string>('');
  errMsg = signal<string>('');

  constructor(private commentsService: CommentsService) {}

  ngOnInit() {
    this.loadComments();
  }

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
          // Sort comments with latest first (by createdAt date)
          const sortedComments = response.data.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.comments.set(sortedComments);
          this.commentsLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load comments:', err);
          this.commentsLoading.set(false);
        }
      });
    }
  }

  onSubmitComment() {
    const text = this.newCommentText().trim();
    
    if (this.itemId && text) {
      this.commentsService.addComment(this.itemId, this.itemType, text).subscribe({
        next: (response) => {
          // Add the new comment at the beginning (latest first)
          const currentComments = this.comments();
          this.comments.set([response.data, ...currentComments]);
          this.newCommentText.set(''); // Clear the form
          this.errMsg.set(''); // Clear any errors
        },
        error: (err) => {
          console.error('Failed to add comment:', err);
          this.errMsg.set('Failed to add comment');
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
