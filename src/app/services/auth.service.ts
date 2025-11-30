import {Injectable, signal, computed} from '@angular/core';
import {Router} from '@angular/router';
import {CognitoService} from './cognito.service';
import {AuthTokens, UserInfo, SignUpResult, AuthResult} from '../models';

/**
 * Authentication service managing user authentication state and session.
 * Uses Angular signals for reactive state management.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY_TOKENS = 'auth_tokens';
  private readonly STORAGE_KEY_USER = 'auth_user';

  private readonly authTokensSignal = signal<AuthTokens | null>(null);
  private readonly currentUserSignal = signal<UserInfo | null>(null);

  /**
   * Whether the user is currently authenticated.
   * Computed from the presence of valid tokens.
   */
  readonly isAuthenticated = computed(() => this.authTokensSignal() !== null);

  /**
   * Current authenticated user information.
   * Returns null if user is not authenticated.
   */
  readonly currentUser = computed(() => this.currentUserSignal());

  constructor(
    private readonly cognitoService: CognitoService,
    private readonly router: Router,
  ) {}

  /**
   * Register a new user with email and password.
   * Invokes AWS Cognito SignUp operation.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to sign-up result
   */
  async signUp(email: string, password: string): Promise<SignUpResult> {
    try {
      const result = await this.cognitoService.signUp(email, password);
      return result;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Confirm user sign-up with verification code.
   * Verifies the user's email address using the code sent via email.
   *
   * @param email - User's email address
   * @param code - Verification code from email
   * @returns Promise resolving when confirmation is successful
   */
  async confirmSignUp(email: string, code: string): Promise<void> {
    try {
      await this.cognitoService.confirmSignUp(email, code);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Resend confirmation code to user's email.
   * Useful when the original code expires or is lost.
   *
   * @param email - User's email address
   * @returns Promise resolving when code is resent
   */
  async resendConfirmationCode(email: string): Promise<void> {
    try {
      await this.cognitoService.resendConfirmationCode(email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Authenticate a user with email and password.
   * Stores tokens and user information on success.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to authentication result
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const tokens = await this.cognitoService.initiateAuth(email, password);
      const user = await this.cognitoService.getUserInfo(tokens.idToken);

      this.storeTokens(tokens);
      this.storeUser(user);
      this.authTokensSignal.set(tokens);
      this.currentUserSignal.set(user);

      return {
        success: true,
        tokens,
        user,
      };
    } catch (error) {
      const authError = this.handleAuthError(error);
      return {
        success: false,
        error: authError.message,
      };
    }
  }

  /**
   * Sign out the current user.
   * Clears all stored tokens and user information.
   */
  async signOut(): Promise<void> {
    this.clearTokens();
    this.clearUser();
    this.authTokensSignal.set(null);
    this.currentUserSignal.set(null);
    await this.router.navigate(['/']);
  }

  /**
   * Refresh the current authentication session.
   * Uses the refresh token to obtain new access and ID tokens.
   */
  async refreshSession(): Promise<void> {
    const tokens = this.authTokensSignal();

    if (!tokens || !tokens.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const newTokens = await this.cognitoService.refreshTokens(tokens.refreshToken);
      const user = await this.cognitoService.getUserInfo(newTokens.idToken);

      this.storeTokens(newTokens);
      this.storeUser(user);
      this.authTokensSignal.set(newTokens);
      this.currentUserSignal.set(user);
    } catch (error) {
      await this.signOut();
      throw this.handleAuthError(error);
    }
  }

  /**
   * Initialize authentication state from stored tokens.
   * Called on application startup to restore user session.
   */
  async initializeAuth(): Promise<void> {
    const storedTokens = this.retrieveTokens();
    const storedUser = this.retrieveUser();

    if (!storedTokens || !storedUser) {
      return;
    }

    if (this.isTokenExpired(storedTokens)) {
      try {
        await this.refreshSession();
      } catch (error) {
        await this.signOut();
      }
      return;
    }

    this.authTokensSignal.set(storedTokens);
    this.currentUserSignal.set(storedUser);
  }

  /**
   * Store authentication tokens in session storage.
   *
   * @param tokens - Authentication tokens to store
   */
  private storeTokens(tokens: AuthTokens): void {
    const tokenData = {
      ...tokens,
      storedAt: Date.now(),
    };
    sessionStorage.setItem(this.STORAGE_KEY_TOKENS, JSON.stringify(tokenData));
  }

  /**
   * Retrieve authentication tokens from session storage.
   *
   * @returns Stored tokens or null if not found
   */
  private retrieveTokens(): AuthTokens | null {
    const stored = sessionStorage.getItem(this.STORAGE_KEY_TOKENS);
    if (!stored) {
      return null;
    }

    try {
      const parsed = JSON.parse(stored);
      return {
        idToken: parsed.idToken,
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        expiresIn: parsed.expiresIn,
        tokenType: parsed.tokenType,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear authentication tokens from session storage.
   */
  private clearTokens(): void {
    sessionStorage.removeItem(this.STORAGE_KEY_TOKENS);
  }

  /**
   * Store user information in session storage.
   *
   * @param user - User information to store
   */
  private storeUser(user: UserInfo): void {
    sessionStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
  }

  /**
   * Retrieve user information from session storage.
   *
   * @returns Stored user or null if not found
   */
  private retrieveUser(): UserInfo | null {
    const stored = sessionStorage.getItem(this.STORAGE_KEY_USER);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear user information from session storage.
   */
  private clearUser(): void {
    sessionStorage.removeItem(this.STORAGE_KEY_USER);
  }

  /**
   * Check whether authentication tokens are expired.
   *
   * @param tokens - Tokens to check
   * @returns Whether tokens are expired
   */
  private isTokenExpired(tokens: AuthTokens): boolean {
    const stored = sessionStorage.getItem(this.STORAGE_KEY_TOKENS);
    if (!stored) {
      return true;
    }

    try {
      const parsed = JSON.parse(stored);
      const storedAt = parsed.storedAt || 0;
      const expiresIn = tokens.expiresIn * 1000;
      const now = Date.now();

      return now - storedAt >= expiresIn;
    } catch (error) {
      return true;
    }
  }

  /**
   * Handle authentication errors and convert to user-friendly format.
   * Provides specific error messages for common AWS Cognito error scenarios.
   *
   * @param error - Error from AWS Cognito
   * @returns Formatted error object with user-friendly message
   */
  private handleAuthError(error: unknown): Error {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      const name = error.name?.toLowerCase() || '';

      if (name.includes('usernameexistsexception') || message.includes('user already exists')) {
        return new Error('An account with this email already exists');
      }

      if (
        name.includes('invalidpasswordexception') ||
        message.includes('password') && (message.includes('invalid') || message.includes('policy'))
      ) {
        return new Error(
          'Password does not meet requirements: must be at least 8 characters with uppercase, lowercase, number, and special character',
        );
      }

      if (
        name.includes('notauthorizedexception') ||
        message.includes('incorrect username or password')
      ) {
        return new Error('Invalid email or password');
      }

      if (name.includes('usernotfoundexception') || message.includes('user not found')) {
        return new Error('No account found with this email');
      }

      if (
        name.includes('usernotconfirmedexception') ||
        message.includes('user is not confirmed')
      ) {
        return new Error('Please verify your email address before logging in');
      }

      if (
        name.includes('networkerror') ||
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('connection')
      ) {
        return new Error(
          'Network connection failed. Please check your internet connection and try again',
        );
      }

      if (name.includes('limitexceededexception') || message.includes('limit exceeded')) {
        return new Error('Too many attempts. Please try again later');
      }

      if (name.includes('invalidparameterexception')) {
        return new Error('Invalid input provided. Please check your information and try again');
      }

      return error;
    }

    if (typeof error === 'object' && error !== null) {
      const awsError = error as {name?: string; message?: string; code?: string};
      const message = awsError.message || 'Authentication failed';
      return new Error(message);
    }

    return new Error('An unexpected error occurred. Please try again');
  }
}
