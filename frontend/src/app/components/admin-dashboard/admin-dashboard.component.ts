import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { AuthService, User } from '../../core/services/auth.service';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  currentUser: User | null = null;
  activeTab = signal('add-content');

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.currentUser = user;
        if (!user) {
          this.router.navigate(['/login']);
        } else if (user.role !== 'admin') {
          this.router.navigate(['/dashboard']);
        }
      });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.includes('/admin/add-content')) this.activeTab.set('add-content');
    });

    const currentUrl = this.router.url;
    if (currentUrl === '/admin' || currentUrl === '/admin/') {
      this.router.navigate(['/admin/add-content']);
    }
  }

  navigateToAddContent(): void {
    this.router.navigate(['/admin/add-content']);
    this.activeTab.set('add-content');
  }

  navigateToUserDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
