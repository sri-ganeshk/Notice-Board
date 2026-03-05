import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService, Event } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CommentsComponent } from '../../components/comments/comments.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatListModule,
    CommentsComponent
  ],
  templateUrl: './event.html',
  styleUrl: './event.css'
})
export class EventPage implements OnInit {
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  data = signal<Event | undefined>(undefined);
  errMsg = signal<string>('');
  loading = signal<boolean>(true);
  registering = signal<boolean>(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.eventService.getEventById(id).subscribe({
        next: (response) => {
          this.data.set(response.data);
          this.loading.set(false);
        },
        error: (err) => {
          const msg = err.error?.message || 'Failed to load event';
          this.errMsg.set(msg);
          this.toast.error(msg);
          this.loading.set(false);
        }
      });
    } else {
      const msg = 'Event not found';
      this.errMsg.set(msg);
      this.loading.set(false);
    }
  }

  registerForEvent() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId && !this.registering()) {
      this.registering.set(true);
      this.errMsg.set('');

      this.eventService.registerForEvent(eventId).subscribe({
        next: (response) => {
          this.data.set(response.data);
          this.registering.set(false);
          this.toast.success('Registered for event successfully!');
        },
        error: (err) => {
          const msg = err.error?.message || 'Failed to register for event';
          this.errMsg.set(msg);
          this.toast.error(msg);
          this.registering.set(false);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  isUserRegistered(): boolean {
    const currentUser = this.authService.currentUser;
    const event = this.data();
    if (!currentUser || !event) return false;
    return this.eventService.isUserRegistered(event, currentUser.id);
  }

  isEventUpcoming(): boolean {
    const event = this.data();
    return event ? this.eventService.isEventUpcoming(event) : false;
  }

  isEventPast(): boolean {
    const event = this.data();
    return event ? this.eventService.isEventPast(event) : false;
  }

  getRegisteredUserCount(): number {
    const event = this.data();
    return event ? this.eventService.getRegisteredUserCount(event) : 0;
  }

  getEventStatus(): string {
    if (this.isEventPast()) return 'past';
    if (this.isEventUpcoming()) return 'upcoming';
    return 'ongoing';
  }

  getStatusIcon(): string {
    switch (this.getEventStatus()) {
      case 'past': return 'event_busy';
      case 'upcoming': return 'event_available';
      default: return 'event';
    }
  }

  getStatusColor(): string {
    switch (this.getEventStatus()) {
      case 'past': return 'warn';
      case 'upcoming': return 'primary';
      default: return 'accent';
    }
  }
}
