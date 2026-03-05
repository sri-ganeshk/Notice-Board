import { Component, signal, OnInit, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Notice, NoticeService } from '../../core/services/notice.service';
import { ToastService } from '../../core/services/toast.service';
import { NoticeComponent } from '../notice-card/notice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [NoticeComponent, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './notices.html',
  styleUrl: './notices.css'
})
export class Notices implements OnInit {
  private noticeService = inject(NoticeService);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  notices = signal<Notice[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  searchTerm = signal('');
  selectedCategory = signal('all');
  sortBy = signal('newest');

  categories = ['all', 'academic', 'sports', 'cultural'];
  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' }
  ];

  filteredNotices = computed(() => {
    let filtered = this.notices();

    if (this.searchTerm()) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        notice.content.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }

    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(notice =>
        notice.category?.toLowerCase() === this.selectedCategory().toLowerCase()
      );
    }

    const sortBy = this.sortBy();
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title': return a.title.localeCompare(b.title);
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  });

  ngOnInit() {
    this.noticeService.getAllNotices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.notices.set(response.data);
          this.loading.set(false);
        },
        error: (error) => {
          const msg = error.error?.message || 'Failed to load notices';
          this.errorMessage.set(msg);
          this.toast.error(msg);
          this.loading.set(false);
        }
      });
  }

  onSearchChange(term: string) { this.searchTerm.set(term); }
  onCategoryChange(category: string) { this.selectedCategory.set(category); }
  onSortChange(sort: string) { this.sortBy.set(sort); }
  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
    this.sortBy.set('newest');
  }
}
