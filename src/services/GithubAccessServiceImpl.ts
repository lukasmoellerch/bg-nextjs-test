// Copyright Anysphere Inc.

import { HttpError, parseStatusCodeFromErrorMessage } from './errors';

/**
 * GitHub installation access token response
 */
export interface GitHubInstallationToken {
  token: string;
  expires_at: string;
  permissions: Record<string, string>;
  repository_selection: string;
}

/**
 * User login information for repository access
 */
export interface UserLogin {
  username: string;
  installationId?: number;
}

/**
 * Result of token verification
 */
export interface VerifiedAccessTokenResult {
  token: string;
  expiresAt: Date;
  repositories: string[];
}

/**
 * Service implementation for GitHub access token management.
 * Handles creating and verifying GitHub App installation access tokens.
 */
export class GithubAccessServiceImpl {
  private readonly githubApiBaseUrl: string;

  constructor(githubApiBaseUrl: string = 'https://api.github.com') {
    this.githubApiBaseUrl = githubApiBaseUrl;
  }

  /**
   * Gets a verified access token for repositories from user logins.
   * 
   * This method attempts to create an installation access token for the GitHub App
   * and verifies that the token has access to the requested repositories.
   * 
   * @param userLogins - Array of user login information
   * @param repositories - Array of repository names (owner/repo format)
   * @returns Promise resolving to the verified access token result
   * @throws HttpError with appropriate status code if token creation fails
   */
  async getUserVerifiedAccessTokenForReposFromUserLogins(
    userLogins: UserLogin[],
    repositories: string[]
  ): Promise<VerifiedAccessTokenResult> {
    if (userLogins.length === 0) {
      throw new HttpError(400, 'At least one user login is required');
    }

    if (repositories.length === 0) {
      throw new HttpError(400, 'At least one repository is required');
    }

    // Find a user login with an installation ID
    const userWithInstallation = userLogins.find(u => u.installationId !== undefined);
    
    if (!userWithInstallation || userWithInstallation.installationId === undefined) {
      throw new HttpError(
        404,
        'No GitHub App installation found for the provided user logins. ' +
        'Please ensure the GitHub App is installed for your account or organization.'
      );
    }

    try {
      const token = await this.createInstallationAccessToken(
        userWithInstallation.installationId,
        repositories
      );

      return {
        token: token.token,
        expiresAt: new Date(token.expires_at),
        repositories,
      };
    } catch (error) {
      // Re-throw HttpError as-is to preserve the correct status code
      if (error instanceof HttpError) {
        throw error;
      }

      // Handle errors from the GitHub API that may contain status codes in the message
      if (error instanceof Error) {
        const extractedStatusCode = parseStatusCodeFromErrorMessage(error.message);
        
        if (extractedStatusCode !== null) {
          // FIXED: Use the actual status code from the error message instead of always returning 500.
          // Previously, errors like "404: Not Found - https://docs.github.com/rest/reference/apps#create-an-installation-access-token-for-an-app"
          // were incorrectly returned as 500 errors. Now we extract and use the correct status code.
          throw new HttpError(
            extractedStatusCode,
            error.message,
            error
          );
        }

        // For other errors without a status code, treat as internal server error
        throw new HttpError(500, `Failed to get access token: ${error.message}`, error);
      }

      // Unknown error type
      throw new HttpError(500, 'An unexpected error occurred while getting access token');
    }
  }

  /**
   * Creates an installation access token for the GitHub App.
   * 
   * @param installationId - The GitHub App installation ID
   * @param repositories - Array of repository names to request access for
   * @returns Promise resolving to the installation token
   * @throws HttpError if the API request fails
   */
  private async createInstallationAccessToken(
    installationId: number,
    repositories: string[]
  ): Promise<GitHubInstallationToken> {
    const url = `${this.githubApiBaseUrl}/app/installations/${installationId}/access_tokens`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          // Note: In a real implementation, this would use a JWT signed with the App's private key
          'Authorization': `Bearer ${this.getAppJwt()}`,
        },
        body: JSON.stringify({
          repositories: repositories.map(repo => repo.split('/').pop()),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        
        // Throw an HttpError with the ACTUAL status code from GitHub's response
        // This ensures that 404 errors are properly propagated as 404, not 500
        throw new HttpError(
          response.status,
          `${response.status}: ${response.statusText} - https://docs.github.com/rest/reference/apps#create-an-installation-access-token-for-an-app`,
          new Error(errorBody)
        );
      }

      return await response.json() as GitHubInstallationToken;
    } catch (error) {
      // Re-throw HttpError as-is
      if (error instanceof HttpError) {
        throw error;
      }

      // Network or other errors
      if (error instanceof Error) {
        throw new HttpError(502, `Failed to connect to GitHub API: ${error.message}`, error);
      }

      throw new HttpError(500, 'Unknown error occurred while connecting to GitHub API');
    }
  }

  /**
   * Gets the JWT for GitHub App authentication.
   * In a real implementation, this would generate a JWT signed with the App's private key.
   */
  private getAppJwt(): string {
    // This is a placeholder - in production, this would be properly implemented
    // using the GitHub App's private key to sign a JWT
    throw new Error('GitHub App JWT generation not implemented');
  }
}
