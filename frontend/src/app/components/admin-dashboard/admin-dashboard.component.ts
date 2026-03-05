import { Component, OnInit, signal } from '@angular/core';
import { AuthService, User } from '../../core/services/auth.service';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
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
  currentUser: User | null = null;
  activeTab = signal('add-content');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      } else if (user.role !== 'admin') {
        this.router.navigate(['/dashboard']);
      }
    });

    // Listen to route changes to update active tab
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.url;
      if (url.includes('/admin/add-content')) {
        this.activeTab.set('add-content');
      }
    });

    // Navigate to add-content by default if on admin root
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
