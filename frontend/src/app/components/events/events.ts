import { Component, signal, OnInit, computed } from '@angular/core';
import { EventService, Event } from '../../core/services/event.service';
import { EventCard } from '../event-card/event-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [EventCard, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events implements OnInit {
  constructor(
    private eventService: EventService
  ) {}

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
    
    // Filter by search term
    if (this.searchTerm()) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        event.location?.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }
    
    // Note: Category filtering removed as Event interface doesn't have category property
    // You can add this back when category is added to the Event model
    
    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        case 'date-asc':
          return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'upcoming':
        default:
          const now = new Date().getTime();
          const aTime = new Date(a.eventDate).getTime();
          const bTime = new Date(b.eventDate).getTime();
          
          // Sort upcoming events first, then by date
          if (aTime >= now && bTime >= now) {
            return aTime - bTime;
          } else if (aTime >= now) {
            return -1;
          } else if (bTime >= now) {
            return 1;
          } else {
            return bTime - aTime;
          }
      }
    });
    
    return filtered;
  });

  ngOnInit() {
    this.eventService.getUpcomingEvents().subscribe({
      next: (response) => {
        this.events.set(response.data);
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

  onSortChange(sort: string) {
    this.sortBy.set(sort);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.sortBy.set('upcoming');
  }
}
