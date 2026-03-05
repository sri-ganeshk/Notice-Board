import { Component, OnInit, signal } from '@angular/core';
import { AuthService, User } from '../../core/services/auth.service';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeTab = signal('notices');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });

    // Listen to route changes to update active tab
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.url;
      if (url.includes('/dashboard/notices')) {
        this.activeTab.set('notices');
      } else if (url.includes('/dashboard/events')) {
        this.activeTab.set('events');
      }
    });

    // Navigate to notices by default if on dashboard root
    const currentUrl = this.router.url;
    if (currentUrl === '/dashboard' || currentUrl === '/dashboard/') {
      this.router.navigate(['/dashboard/notices']);
    }
  }

  navigateToNotices(): void {
    this.activeTab.set('notices');
    this.router.navigate(['/dashboard/notices']);
  }

  navigateToEvents(): void {
    this.activeTab.set('events');
    this.router.navigate(['/dashboard/events']);
  }
}
