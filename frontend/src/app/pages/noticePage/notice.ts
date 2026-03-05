import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticeService, Notice } from '../../core/services/notice.service';
import { CommentsComponent } from '../../components/comments/comments.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notice-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    CommentsComponent
  ],
  templateUrl: './notice.html',
  styleUrl: './notice.css'
})
export class NoticePage implements OnInit {
  constructor(
    private noticeService: NoticeService,
    private route: ActivatedRoute
  ) {}

  data = signal<Notice | undefined>(undefined);
  errMsg = signal<string>('');
  loading = signal<boolean>(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // Load notice data
      this.noticeService.getNoticeById(id).subscribe({
        next: (response) => {
          this.data.set(response.data);
          this.loading.set(false);
        },
        error: (err) => {
          this.errMsg.set(err.message);
          this.loading.set(false);
        }
      });
    } else {
      this.errMsg.set('No ID provided in route parameters');
      this.loading.set(false);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  getCategoryColor(category: string | undefined): string {
    switch (category) {
      case 'academic': return 'primary';
      case 'sports': return 'accent';
      case 'cultural': return 'warn';
      default: return 'primary';
    }
  }

  getCategoryIcon(category: string | undefined): string {
    switch (category) {
      case 'academic': return 'school';
      case 'sports': return 'sports';
      case 'cultural': return 'theater_comedy';
      default: return 'info';
    }
  }
}
