import { Component, signal, OnInit, computed } from '@angular/core';
import { Notice, NoticeService } from '../../core/services/notice.service';
import { NoticeComponent } from '../notice-card/notice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [NoticeComponent, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './notices.html',
  styleUrl: './notices.css'
})
export class Notices implements OnInit {

  constructor(
    private noticeService: NoticeService
  ) { }

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
    
    // Filter by search term
    if (this.searchTerm()) {
      filtered = filtered.filter(notice => 
        notice.title.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        notice.content.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }
    
    // Filter by category
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(notice => 
        notice.category?.toLowerCase() === this.selectedCategory().toLowerCase()
      );
    }
    
    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return filtered;
  });

  ngOnInit() {
    this.noticeService.getAllNotices().subscribe({
      next: (response) => {
        this.notices.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
  }

  onSortChange(sort: string) {
    this.sortBy.set(sort);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
    this.sortBy.set('newest');
  }
}
