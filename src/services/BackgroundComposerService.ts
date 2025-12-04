// Copyright Anysphere Inc.

import { GithubAccessServiceImpl, UserLogin } from './GithubAccessServiceImpl';
import { HttpError } from './errors';

/**
 * Snapshot data for starting a background composer
 */
export interface ComposerSnapshot {
  id: string;
  repositories: string[];
  userLogins: UserLogin[];
  workspaceConfig: Record<string, unknown>;
}

/**
 * Result of starting a background composer
 */
export interface BackgroundComposerResult {
  composerId: string;
  status: 'started' | 'error';
  accessToken?: string;
  error?: string;
}

/**
 * Service for managing background composer operations.
 * Handles starting, stopping, and managing background composer instances.
 */
export class BackgroundComposerService {
  private readonly githubAccessService: GithubAccessServiceImpl;

  constructor(githubAccessService?: GithubAccessServiceImpl) {
    this.githubAccessService = githubAccessService ?? new GithubAccessServiceImpl();
  }

  /**
   * Starts a background composer from a saved snapshot.
   * 
   * This method:
   * 1. Validates the snapshot data
   * 2. Obtains GitHub access tokens for the required repositories
   * 3. Initializes the background composer with the workspace configuration
   * 
   * @param snapshot - The composer snapshot containing configuration and user information
   * @returns Promise resolving to the background composer result
   * @throws HttpError with appropriate status code if the operation fails
   */
  async startBackgroundComposerFromSnapshot(
    snapshot: ComposerSnapshot
  ): Promise<BackgroundComposerResult> {
    // Validate snapshot
    if (!snapshot.id) {
      throw new HttpError(400, 'Snapshot ID is required');
    }

    if (!snapshot.repositories || snapshot.repositories.length === 0) {
      throw new HttpError(400, 'At least one repository is required in the snapshot');
    }

    if (!snapshot.userLogins || snapshot.userLogins.length === 0) {
      throw new HttpError(400, 'At least one user login is required in the snapshot');
    }

    try {
      // Get verified access token for the repositories
      const tokenResult = await this.githubAccessService.getUserVerifiedAccessTokenForReposFromUserLogins(
        snapshot.userLogins,
        snapshot.repositories
      );

      // Initialize the background composer (placeholder for actual implementation)
      const composerId = await this.initializeComposer(snapshot, tokenResult.token);

      return {
        composerId,
        status: 'started',
        accessToken: tokenResult.token,
      };
    } catch (error) {
      // FIXED: Properly propagate HttpError with its original status code.
      // Previously, all errors from getUserVerifiedAccessTokenForReposFromUserLogins
      // were potentially being wrapped or transformed into 5xx errors.
      // Now we preserve the original status code (e.g., 404 for "Not Found" errors).
      if (error instanceof HttpError) {
        // Re-throw the HttpError as-is to preserve the correct status code
        throw error;
      }

      // For unexpected errors, wrap in a 500 Internal Server Error
      if (error instanceof Error) {
        throw new HttpError(
          500,
          `Failed to start background composer: ${error.message}`,
          error
        );
      }

      throw new HttpError(500, 'An unexpected error occurred while starting background composer');
    }
  }

  /**
   * Initializes a composer instance with the given configuration.
   * 
   * @param snapshot - The composer snapshot
   * @param accessToken - The GitHub access token (used in actual implementation)
   * @returns Promise resolving to the composer ID
   */
  private async initializeComposer(
    snapshot: ComposerSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    accessToken: string
  ): Promise<string> {
    // Placeholder implementation
    // In a real implementation, this would set up the actual composer instance
    // using the accessToken to authenticate with GitHub
    return `composer-${snapshot.id}-${Date.now()}`;
  }

  /**
   * Stops a running background composer.
   * 
   * @param composerId - The ID of the composer to stop
   * @returns Promise resolving when the composer is stopped
   */
  async stopBackgroundComposer(composerId: string): Promise<void> {
    if (!composerId) {
      throw new HttpError(400, 'Composer ID is required');
    }

    // Placeholder implementation
    // In a real implementation, this would stop the actual composer instance
  }
}
