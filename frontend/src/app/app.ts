import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, User } from './core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  currentUser: User | null = null;
  showNavbar = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user authentication state
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.showNavbar.set(!!user); // Show navbar only when user is logged in
    });

    // Listen to route changes to update navbar visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.url;
      
      // Show navbar only on authenticated pages (not login/signup)
      this.showNavbar.set(!url.includes('/login') && !url.includes('/signup') && !!this.currentUser);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }
}
