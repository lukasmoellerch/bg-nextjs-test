// Copyright Anysphere Inc.

/**
 * Custom HTTP error class that preserves the original HTTP status code
 * from external API responses (like GitHub's API).
 */
export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly originalError?: Error;

  constructor(statusCode: number, message: string, originalError?: Error) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.originalError = originalError;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }

  /**
   * Check if this is a client error (4xx status code)
   */
  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if this is a server error (5xx status code)
   */
  isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }
}

/**
 * Parses an error message that may contain an HTTP status code prefix
 * (e.g., "404: Not Found - ...") and extracts the status code.
 * 
 * @param errorMessage The error message to parse
 * @returns The extracted status code, or null if no valid status code prefix is found
 */
export function parseStatusCodeFromErrorMessage(errorMessage: string): number | null {
  // Match patterns like "404: Not Found" or "500: Internal Server Error"
  const match = errorMessage.match(/^(\d{3}):\s/);
  if (match) {
    const statusCode = parseInt(match[1], 10);
    if (statusCode >= 100 && statusCode < 600) {
      return statusCode;
    }
  }
  return null;
}
