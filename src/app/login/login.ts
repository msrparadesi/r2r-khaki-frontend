import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from '../services';
import {LoadingSpinnerComponent} from '../loading-spinner';

/**
 * Login component for user authentication.
 * Provides a form for email and password input with validation.
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './login.html',
  styleUrl: './login.sass',
})
export class LoginComponent {
  protected loginForm: FormGroup;
  protected errorMessage: string | null = null;
  protected isSubmitting = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Handle form submission.
   * Calls AuthService.signIn with form values.
   */
  protected async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const {email, password} = this.loginForm.value;

    try {
      const result = await this.authService.signIn(email, password);

      if (result.success) {
        await this.router.navigate(['/home']);
      } else {
        this.errorMessage = result.error || 'Login failed. Please try again.';
      }
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = this.getErrorMessage(error);
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Get user-friendly error message based on error type.
   * Handles various error scenarios including network failures.
   *
   * @param error - Error from authentication service
   * @returns User-friendly error message
   */
  private getErrorMessage(error: Error): string {
    const message = error.message.toLowerCase();

    if (
      message.includes('incorrect username or password') ||
      message.includes('notauthorizedexception') ||
      message.includes('user not found') ||
      message.includes('invalid email or password')
    ) {
      return 'Invalid email or password. Please try again.';
    }

    if (message.includes('user is not confirmed') || message.includes('verify your email')) {
      return 'Please verify your email address before logging in.';
    }

    if (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('connection')
    ) {
      return 'Network connection failed. Please check your internet connection and try again.';
    }

    if (message.includes('limit exceeded') || message.includes('too many attempts')) {
      return 'Too many login attempts. Please wait a few minutes and try again.';
    }

    return error.message || 'Login failed. Please try again.';
  }

  /**
   * Navigate to the sign-up page.
   */
  protected navigateToSignUp(): void {
    this.router.navigate(['/signup']);
  }

  /**
   * Get validation error message for a form field.
   *
   * @param fieldName - Name of the form field
   * @returns Error message or null
   */
  protected getFieldError(fieldName: string): string | null {
    const field = this.loginForm.get(fieldName);

    if (!field || !field.touched || !field.errors) {
      return null;
    }

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }

    if (fieldName === 'email' && field.errors['email']) {
      return 'Please enter a valid email address.';
    }

    return null;
  }
}
