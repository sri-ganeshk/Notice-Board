import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { AuthService, User } from '../../core/services/auth.service';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  currentUser: User | null = null;
  activeTab = signal('notices');

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.currentUser = user;
        if (!user) this.router.navigate(['/login']);
      });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event: NavigationEnd) => {
      const url = event.url;
      if (url.includes('/dashboard/events')) this.activeTab.set('events');
      else if (url.includes('/dashboard/notices')) this.activeTab.set('notices');
    });

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
