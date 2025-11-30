import {inject} from '@angular/core';
import {CanActivateFn, Router, Routes, UrlTree} from '@angular/router';
import {UnauthenticatedLanding} from './unauthenticated-landing';
import {AuthenticatedLanding} from './authenticated-landing';
import {SignUpComponent} from './sign-up';
import {LoginComponent} from './login';
import {authGuard} from './guards/auth.guard';
import {AuthService} from './services/auth.service';

/**
 * Guard that redirects authenticated users away from public pages.
 * Used to prevent authenticated users from accessing login/signup pages.
 */
const unauthGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [unauthGuard],
    component: UnauthenticatedLanding,
  },
  {
    path: 'home',
    canActivate: [authGuard],
    component: AuthenticatedLanding,
  },
  {
    path: 'signup',
    canActivate: [unauthGuard],
    component: SignUpComponent,
  },
  {
    path: 'login',
    canActivate: [unauthGuard],
    component: LoginComponent,
  },
  {
    path: 'dog',
    canActivate: [authGuard],
    component: AuthenticatedLanding, // Placeholder - will be replaced with pet chat component
  },
  {
    path: 'cat',
    canActivate: [authGuard],
    component: AuthenticatedLanding, // Placeholder - will be replaced with pet chat component
  },
  {
    path: 'hamster',
    canActivate: [authGuard],
    component: AuthenticatedLanding, // Placeholder - will be replaced with pet chat component
  },
  {
    path: '**',
    redirectTo: '',
  },
];
