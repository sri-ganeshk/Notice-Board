import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const currentUser = this.authService.currentUser;
    
    if (currentUser && currentUser.role === 'admin') {
      return true;
    }
    
    // Redirect to dashboard if not admin
    this.router.navigate(['/dashboard']);
    return false;
  }
}
