import {Component} from '@angular/core';
import {Router} from '@angular/router';

/**
 * Unauthenticated landing page component.
 * Displays welcome message and provides navigation to sign-up and login pages.
 */
@Component({
  selector: 'app-unauthenticated-landing',
  imports: [],
  templateUrl: './unauthenticated-landing.html',
  styleUrl: './unauthenticated-landing.sass',
})
export class UnauthenticatedLanding {
  constructor(private readonly router: Router) {}

  /**
   * Navigate to the sign-up page.
   */
  protected navigateToSignUp(): void {
    this.router.navigate(['/signup']);
  }

  /**
   * Navigate to the login page.
   */
  protected navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
