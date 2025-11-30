import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../services/auth.service';

/**
 * Header component displaying application name and authentication-based navigation.
 * Shows logout button for authenticated users.
 */
@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.sass',
})
export class Header {
  private readonly authService = inject(AuthService);

  protected readonly isAuthenticated = this.authService.isAuthenticated;

  /**
   * Handle logout button click.
   * Signs out the user and clears authentication state.
   */
  protected async onLogout(): Promise<void> {
    await this.authService.signOut();
  }
}
