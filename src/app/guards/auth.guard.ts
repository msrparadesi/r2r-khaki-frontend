import {inject} from '@angular/core';
import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

/**
 * Route guard that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 *
 * @param route - The activated route snapshot
 * @param state - The router state snapshot
 * @returns Whether the route can be activated or a redirect URL
 */
export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
