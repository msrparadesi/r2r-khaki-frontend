/**
 * JWT authentication tokens returned by AWS Cognito.
 */
export interface AuthTokens {
  /** JWT ID token containing user identity claims */
  idToken: string;
  /** JWT access token for API authorization */
  accessToken: string;
  /** Refresh token for obtaining new access tokens */
  refreshToken: string;
  /** Token expiration time in seconds */
  expiresIn: number;
  /** Token type (typically "Bearer") */
  tokenType: string;
}
