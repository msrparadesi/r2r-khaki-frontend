/**
 * Result of a user registration operation.
 */
export interface SignUpResult {
  /** Cognito user ID (sub) of the newly created user */
  userSub: string;
  /** Whether the user account is confirmed */
  userConfirmed: boolean;
  /** Details about verification code delivery (if applicable) */
  codeDeliveryDetails?: {
    /** Destination where the code was sent (e.g., email address) */
    destination: string;
    /** Delivery method (e.g., "EMAIL") */
    deliveryMedium: string;
    /** Attribute being verified (e.g., "email") */
    attributeName: string;
  };
}
