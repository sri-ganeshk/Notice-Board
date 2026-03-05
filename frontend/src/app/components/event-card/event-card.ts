import { Component,Input } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from '../../core/services/event.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css'
})
export class EventCard {

  @Input () event: Event | null = null;

  constructor(private router: Router) {}

  onEventClick() {
    if (this.event?._id) {
      this.router.navigate(['/event', this.event._id]);
    }
  }

}
