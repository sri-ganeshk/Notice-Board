import { Component, signal, OnInit, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService, Event } from '../../core/services/event.service';
import { ToastService } from '../../core/services/toast.service';
import { EventCard } from '../event-card/event-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [EventCard, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events implements OnInit {
  private eventService = inject(EventService);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  events = signal<Event[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  searchTerm = signal('');
  sortBy = signal('upcoming');

  sortOptions = [
    { value: 'upcoming', label: 'Upcoming First' },
    { value: 'date-desc', label: 'Latest First' },
    { value: 'date-asc', label: 'Earliest First' },
    { value: 'title', label: 'Title A-Z' }
  ];

  filteredEvents = computed(() => {
    let filtered = this.events();

    if (this.searchTerm()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        event.location?.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }

    const sortBy = this.sortBy();
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        case 'date-asc': return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        case 'title': return a.title.localeCompare(b.title);
        default: {
          const now = new Date().getTime();
          const aTime = new Date(a.eventDate).getTime();
          const bTime = new Date(b.eventDate).getTime();
          if (aTime >= now && bTime >= now) return aTime - bTime;
          if (aTime >= now) return -1;
          if (bTime >= now) return 1;
          return bTime - aTime;
        }
      }
    });
  });

  ngOnInit() {
    this.eventService.getUpcomingEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.events.set(response.data);
          this.loading.set(false);
        },
        error: (error) => {
          const msg = error.error?.message || 'Failed to load events';
          this.errorMessage.set(msg);
          this.toast.error(msg);
          this.loading.set(false);
        }
      });
  }

  onSearchChange(term: string) { this.searchTerm.set(term); }
  onSortChange(sort: string) { this.sortBy.set(sort); }
  clearFilters() {
    this.searchTerm.set('');
    this.sortBy.set('upcoming');
  }
}
