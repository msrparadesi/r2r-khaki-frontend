/**
 * Utility for retrying failed operations with exponential backoff.
 */

/**
 * Configuration options for retry behavior.
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Initial delay in milliseconds before first retry */
  initialDelay: number;
  /** Maximum delay in milliseconds between retries */
  maxDelay: number;
  /** Multiplier for exponential backoff */
  backoffMultiplier: number;
  /** Function to determine if error is retryable */
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Default retry configuration.
 */
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

/**
 * Retry an async operation with exponential backoff.
 * Useful for handling transient network failures.
 *
 * @param operation - Async function to retry
 * @param options - Retry configuration options
 * @returns Promise resolving to operation result
 * @throws Last error if all retry attempts fail
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const config = {...DEFAULT_RETRY_OPTIONS, ...options};
  let lastError: unknown;
  let delay = config.initialDelay;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (config.shouldRetry && !config.shouldRetry(error)) {
        throw error;
      }

      if (attempt === config.maxAttempts) {
        throw error;
      }

      await sleep(delay);

      delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
    }
  }

  throw lastError;
}

/**
 * Determine whether an error is a network-related error that should be retried.
 *
 * @param error - Error to check
 * @returns Whether error is retryable
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('fetch') ||
      name.includes('networkerror') ||
      name.includes('timeouterror')
    );
  }

  return false;
}

/**
 * Sleep for specified milliseconds.
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
