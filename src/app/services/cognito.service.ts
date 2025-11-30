import {Injectable} from '@angular/core';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {environment} from '../../environments/environment';
import {SignUpResult, AuthTokens, UserInfo} from '../models';
import {retryWithBackoff, isNetworkError} from '../utils';

/**
 * Service for interacting with AWS Cognito User Pool.
 * Wraps AWS SDK operations for authentication and user management.
 */
@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private readonly client: CognitoIdentityProviderClient;
  private readonly userPoolClientId: string;

  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: environment.aws.region,
    });
    this.userPoolClientId = environment.aws.userPoolClientId;
  }

  /**
   * Register a new user with AWS Cognito User Pool.
   * Invokes the SignUp operation with email and password.
   * Retries on network failures with exponential backoff.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to sign-up result with user details
   */
  async signUp(email: string, password: string): Promise<SignUpResult> {
    return retryWithBackoff(
      async () => {
        const command = new SignUpCommand({
          ClientId: this.userPoolClientId,
          Username: email,
          Password: password,
          UserAttributes: [
            {
              Name: 'email',
              Value: email,
            },
          ],
        });

        const response = await this.client.send(command);

        return {
          userSub: response.UserSub || '',
          userConfirmed: response.UserConfirmed || false,
          codeDeliveryDetails: response.CodeDeliveryDetails
            ? {
                destination: response.CodeDeliveryDetails.Destination || '',
                deliveryMedium: response.CodeDeliveryDetails.DeliveryMedium || '',
                attributeName: response.CodeDeliveryDetails.AttributeName || '',
              }
            : undefined,
        };
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        shouldRetry: isNetworkError,
      },
    );
  }

  /**
   * Authenticate a user with email and password.
   * Invokes the InitiateAuth operation with USER_PASSWORD_AUTH flow.
   * Retries on network failures with exponential backoff.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to authentication tokens
   */
  async initiateAuth(email: string, password: string): Promise<AuthTokens> {
    return retryWithBackoff(
      async () => {
        const command = new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: this.userPoolClientId,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        });

        const response = await this.client.send(command);

        if (!response.AuthenticationResult) {
          throw new Error('Authentication failed: No tokens returned');
        }

        return {
          idToken: response.AuthenticationResult.IdToken || '',
          accessToken: response.AuthenticationResult.AccessToken || '',
          refreshToken: response.AuthenticationResult.RefreshToken || '',
          expiresIn: response.AuthenticationResult.ExpiresIn || 3600,
          tokenType: response.AuthenticationResult.TokenType || 'Bearer',
        };
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        shouldRetry: isNetworkError,
      },
    );
  }

  /**
   * Refresh authentication tokens using a refresh token.
   * Invokes the InitiateAuth operation with REFRESH_TOKEN_AUTH flow.
   * Retries on network failures with exponential backoff.
   *
   * @param refreshToken - Valid refresh token
   * @returns Promise resolving to new authentication tokens
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    return retryWithBackoff(
      async () => {
        const command = new InitiateAuthCommand({
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: this.userPoolClientId,
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
          },
        });

        const response = await this.client.send(command);

        if (!response.AuthenticationResult) {
          throw new Error('Token refresh failed: No tokens returned');
        }

        return {
          idToken: response.AuthenticationResult.IdToken || '',
          accessToken: response.AuthenticationResult.AccessToken || '',
          refreshToken: refreshToken,
          expiresIn: response.AuthenticationResult.ExpiresIn || 3600,
          tokenType: response.AuthenticationResult.TokenType || 'Bearer',
        };
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        shouldRetry: isNetworkError,
      },
    );
  }

  /**
   * Extract user information from JWT ID token.
   * Decodes the JWT token to retrieve user claims.
   *
   * @param idToken - JWT ID token from authentication
   * @returns Promise resolving to user information
   */
  async getUserInfo(idToken: string): Promise<UserInfo> {
    const payload = this.decodeJwtPayload(idToken);

    return {
      email: (payload['email'] as string) || '',
      sub: (payload['sub'] as string) || '',
      emailVerified:
        payload['email_verified'] === true || payload['email_verified'] === 'true',
    };
  }

  /**
   * Decode JWT token payload without verification.
   * This is safe for extracting user info since tokens come from Cognito.
   *
   * @param token - JWT token string
   * @returns Decoded token payload
   */
  private decodeJwtPayload(token: string): Record<string, unknown> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      throw new Error('Failed to decode JWT token');
    }
  }
}
