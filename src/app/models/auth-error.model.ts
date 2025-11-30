/**
 * Authentication error information from AWS Cognito.
 */
export interface AuthError {
  /** Error code identifying the type of error */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Error name/type */
  name: string;
}
