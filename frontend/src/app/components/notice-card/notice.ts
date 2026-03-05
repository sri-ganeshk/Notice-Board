import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Notice } from '../../core/services/notice.service';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notice',
  standalone: true,
  imports: [CommonModule, DatePipe, TitleCasePipe, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './notice.html',
  styleUrl: './notice.css'
})
export class NoticeComponent {

  @Input() notice: Notice | undefined;

  constructor(private router: Router) {}

  onNoticeClick() {
    if (this.notice?._id) {
      this.router.navigate(['/notice', this.notice._id]);
    }
  }

  getCategoryIcon(category: string | undefined): string {
    switch (category) {
      case 'academic':
        return 'school';
      case 'sports':
        return 'sports_soccer';
      case 'cultural':
        return 'palette';
      default:
        return 'info';
    }
  }
}
