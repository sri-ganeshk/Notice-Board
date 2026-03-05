import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUser;

  if (currentUser && currentUser.role === 'admin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};

// Keep class export for backwards compat if needed elsewhere
export { adminGuard as AdminGuard };
