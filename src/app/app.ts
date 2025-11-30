import {Component, OnInit, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from './header';
import {Footer} from './footer';
import {InteractivePetsComponent} from './interactive-pets';
import {AuthService} from './services/auth.service';

/**
 * Root application component with header, footer, and router outlet layout.
 * Initializes authentication state on component initialization.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, InteractivePetsComponent],
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);

  /**
   * Initialize authentication state from stored tokens on app load.
   */
  async ngOnInit(): Promise<void> {
    await this.authService.initializeAuth();
  }
}
