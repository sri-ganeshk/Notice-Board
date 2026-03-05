import { Component, signal, OnInit, inject, DestroyRef } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  protected readonly title = signal('frontend');
  currentUser: User | null = null;
  showNavbar = signal(false);

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.currentUser = user;
        this.showNavbar.set(!!user);
      });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event: NavigationEnd) => {
      const url = event.url;
      this.showNavbar.set(!url.includes('/login') && !url.includes('/signup') && !!this.currentUser);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToDashboard() { this.router.navigate(['/dashboard']); }
  navigateToAdmin() { this.router.navigate(['/admin']); }
}
