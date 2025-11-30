/**
 * User information extracted from authentication tokens.
 */
export interface UserInfo {
  /** User's email address */
  email: string;
  /** Cognito user ID (subject claim from JWT) */
  sub: string;
  /** Whether the user's email has been verified */
  emailVerified: boolean;
}
