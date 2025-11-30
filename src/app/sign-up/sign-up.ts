import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from '../services';
import {LoadingSpinnerComponent} from '../loading-spinner';

/**
 * Sign-up component for user registration.
 * Provides a form for email and password input with validation.
 */
@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.sass',
})
export class SignUpComponent {
  protected signUpForm: FormGroup;
  protected successMessage: string | null = null;
  protected errorMessage: string | null = null;
  protected isSubmitting = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
        ],
      ],
    });
  }

  /**
   * Handle form submission.
   * Calls AuthService.signUp with form values.
   */
  protected async onSubmit(): Promise<void> {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const {email, password} = this.signUpForm.value;

    try {
      const result = await this.authService.signUp(email, password);

      if (result.userConfirmed) {
        this.successMessage = 'Account created successfully! You can now log in.';
      } else {
        this.successMessage =
          'Account created! Please check your email for a verification code.';
      }

      this.signUpForm.reset();
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

    if (message.includes('user already exists') || message.includes('usernameexistsexception')) {
      return 'An account with this email already exists. Please try logging in instead.';
    }

    if (
      message.includes('password') &&
      (message.includes('invalid') ||
        message.includes('does not conform') ||
        message.includes('policy') ||
        message.includes('requirements'))
    ) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
    }

    if (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('connection')
    ) {
      return 'Network connection failed. Please check your internet connection and try again.';
    }

    if (message.includes('limit exceeded') || message.includes('too many attempts')) {
      return 'Too many registration attempts. Please wait a few minutes and try again.';
    }

    if (message.includes('invalid') && message.includes('email')) {
      return 'Please enter a valid email address.';
    }

    return error.message || 'Registration failed. Please try again.';
  }

  /**
   * Navigate to the login page.
   */
  protected navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Get validation error message for a form field.
   *
   * @param fieldName - Name of the form field
   * @returns Error message or null
   */
  protected getFieldError(fieldName: string): string | null {
    const field = this.signUpForm.get(fieldName);

    if (!field || !field.touched || !field.errors) {
      return null;
    }

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }

    if (fieldName === 'email' && field.errors['email']) {
      return 'Please enter a valid email address.';
    }

    if (fieldName === 'password') {
      if (field.errors['minlength']) {
        return 'Password must be at least 8 characters long.';
      }
      if (field.errors['pattern']) {
        return 'Password must include uppercase, lowercase, number, and special character.';
      }
    }

    return null;
  }
}
