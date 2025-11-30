import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

type PetType = 'dog' | 'cat' | 'hamster';

/**
 * Authenticated landing page component.
 * Displays personalized greeting with user email and logout functionality.
 */
@Component({
  selector: 'app-authenticated-landing',
  imports: [],
  templateUrl: './authenticated-landing.html',
  styleUrl: './authenticated-landing.sass',
})
export class AuthenticatedLanding {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentUser = this.authService.currentUser;

  /**
   * Handle logout button click.
   * Signs out the user and clears authentication state.
   */
  protected async onLogout(): Promise<void> {
    await this.authService.signOut();
  }

  /**
   * Navigate to pet chat route.
   */
  protected selectPet(pet: PetType): void {
    this.router.navigate([`/${pet}`]);
  }
}
