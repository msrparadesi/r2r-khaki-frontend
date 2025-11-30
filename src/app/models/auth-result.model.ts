import {AuthTokens} from './auth-tokens.model';
import {UserInfo} from './user-info.model';

/**
 * Result of an authentication operation.
 */
export interface AuthResult {
  /** Whether the authentication was successful */
  success: boolean;
  /** Authentication tokens (present on success) */
  tokens?: AuthTokens;
  /** User information (present on success) */
  user?: UserInfo;
  /** Error message (present on failure) */
  error?: string;
}
