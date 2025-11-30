import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

/**
 * Unauthenticated landing page component.
 * Displays welcome message and provides navigation to sign-up and login pages.
 */
@Component({
  selector: 'app-unauthenticated-landing',
  imports: [CommonModule],
  templateUrl: './unauthenticated-landing.html',
  styleUrl: './unauthenticated-landing.sass',
})
export class UnauthenticatedLanding implements OnInit, OnDestroy {
  protected readonly petAnimals = ['🐶', '🐱', '🐹'];
  protected currentIndex = 0;
  private intervalId?: number;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  private startCarousel(): void {
    this.intervalId = window.setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.petAnimals.length;
    }, 2000);
  }

  private stopCarousel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  protected nextAnimal(): void {
    this.currentIndex = (this.currentIndex + 1) % this.petAnimals.length;
  }

  protected previousAnimal(): void {
    this.currentIndex = (this.currentIndex - 1 + this.petAnimals.length) % this.petAnimals.length;
  }

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
