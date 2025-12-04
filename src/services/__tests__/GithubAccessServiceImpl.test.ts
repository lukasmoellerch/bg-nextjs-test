// Copyright Anysphere Inc.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GithubAccessServiceImpl } from '../GithubAccessServiceImpl';
import { BackgroundComposerService } from '../BackgroundComposerService';
import { HttpError, parseStatusCodeFromErrorMessage } from '../errors';

// Helper to get the service as a type that allows accessing private methods for testing
type ServiceWithPrivateMethods = GithubAccessServiceImpl & {
  getAppJwt: () => string;
};

describe('parseStatusCodeFromErrorMessage', () => {
  it('should extract 404 status code from error message', () => {
    const message = '404: Not Found - https://docs.github.com/rest/reference/apps#create-an-installation-access-token-for-an-app';
    expect(parseStatusCodeFromErrorMessage(message)).toBe(404);
  });

  it('should extract 500 status code from error message', () => {
    const message = '500: Internal Server Error';
    expect(parseStatusCodeFromErrorMessage(message)).toBe(500);
  });

  it('should return null for messages without status code', () => {
    const message = 'Some random error message';
    expect(parseStatusCodeFromErrorMessage(message)).toBeNull();
  });

  it('should return null for invalid status codes', () => {
    const message = '999: Invalid status';
    expect(parseStatusCodeFromErrorMessage(message)).toBeNull();
  });
});

describe('HttpError', () => {
  it('should correctly identify client errors', () => {
    const error = new HttpError(404, 'Not Found');
    expect(error.isClientError()).toBe(true);
    expect(error.isServerError()).toBe(false);
  });

  it('should correctly identify server errors', () => {
    const error = new HttpError(500, 'Internal Server Error');
    expect(error.isClientError()).toBe(false);
    expect(error.isServerError()).toBe(true);
  });

  it('should preserve original error', () => {
    const original = new Error('Original error');
    const error = new HttpError(500, 'Wrapped error', original);
    expect(error.originalError).toBe(original);
  });
});

describe('GithubAccessServiceImpl', () => {
  let service: GithubAccessServiceImpl;

  beforeEach(() => {
    service = new GithubAccessServiceImpl('https://api.github.com');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should throw 400 error for empty user logins', async () => {
    await expect(
      service.getUserVerifiedAccessTokenForReposFromUserLogins([], ['owner/repo'])
    ).rejects.toThrow(HttpError);

    try {
      await service.getUserVerifiedAccessTokenForReposFromUserLogins([], ['owner/repo']);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).statusCode).toBe(400);
    }
  });

  it('should throw 404 error when no installation is found', async () => {
    await expect(
      service.getUserVerifiedAccessTokenForReposFromUserLogins(
        [{ username: 'testuser' }], // No installationId
        ['owner/repo']
      )
    ).rejects.toThrow(HttpError);

    try {
      await service.getUserVerifiedAccessTokenForReposFromUserLogins(
        [{ username: 'testuser' }],
        ['owner/repo']
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).statusCode).toBe(404);
    }
  });

  it('should propagate 404 error from GitHub API correctly (the main fix)', async () => {
    // Mock a 404 response from GitHub's API
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => '{"message": "Not Found"}',
    });
    vi.stubGlobal('fetch', mockFetch);
    
    // Mock the getAppJwt method to return a valid token
    vi.spyOn(service as ServiceWithPrivateMethods, 'getAppJwt').mockReturnValue('mock-jwt-token');

    // This tests the key fix: when GitHub returns a 404 (Not Found) error,
    // the service should throw a 404 HttpError, NOT a 500 error
    try {
      await service.getUserVerifiedAccessTokenForReposFromUserLogins(
        [{ username: 'testuser', installationId: 12345 }],
        ['owner/repo']
      );
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      const httpError = error as HttpError;
      
      // THE KEY ASSERTION: The status code should be 404, not 500
      // This is the bug we fixed - previously, this would have been 500
      expect(httpError.statusCode).toBe(404);
      expect(httpError.isClientError()).toBe(true);
      expect(httpError.isServerError()).toBe(false);
      expect(httpError.message).toContain('404');
      expect(httpError.message).toContain('Not Found');
    }
  });

  it('should propagate 403 forbidden error from GitHub API correctly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      text: async () => '{"message": "Forbidden"}',
    });
    vi.stubGlobal('fetch', mockFetch);
    
    // Mock the getAppJwt method to return a valid token
    vi.spyOn(service as ServiceWithPrivateMethods, 'getAppJwt').mockReturnValue('mock-jwt-token');

    try {
      await service.getUserVerifiedAccessTokenForReposFromUserLogins(
        [{ username: 'testuser', installationId: 12345 }],
        ['owner/repo']
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      const httpError = error as HttpError;
      expect(httpError.statusCode).toBe(403);
      expect(httpError.isClientError()).toBe(true);
    }
  });

  it('should return 502 for network errors', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);
    
    // Mock the getAppJwt method to return a valid token
    vi.spyOn(service as ServiceWithPrivateMethods, 'getAppJwt').mockReturnValue('mock-jwt-token');

    try {
      await service.getUserVerifiedAccessTokenForReposFromUserLogins(
        [{ username: 'testuser', installationId: 12345 }],
        ['owner/repo']
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      const httpError = error as HttpError;
      expect(httpError.statusCode).toBe(502);
    }
  });
});

describe('BackgroundComposerService', () => {
  it('should propagate 404 error from GitHub access service', async () => {
    // Create a mock GithubAccessService that throws a 404 error
    const mockGithubService = {
      getUserVerifiedAccessTokenForReposFromUserLogins: vi.fn().mockRejectedValue(
        new HttpError(
          404,
          '404: Not Found - https://docs.github.com/rest/reference/apps#create-an-installation-access-token-for-an-app'
        )
      ),
    } as unknown as GithubAccessServiceImpl;

    const service = new BackgroundComposerService(mockGithubService);

    try {
      await service.startBackgroundComposerFromSnapshot({
        id: 'test-snapshot',
        repositories: ['owner/repo'],
        userLogins: [{ username: 'testuser', installationId: 12345 }],
        workspaceConfig: {},
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      const httpError = error as HttpError;
      
      // THE KEY ASSERTION: BackgroundComposerService should preserve the 404 status code
      // from the underlying GitHub access service, not convert it to 500
      expect(httpError.statusCode).toBe(404);
      expect(httpError.isClientError()).toBe(true);
      expect(httpError.isServerError()).toBe(false);
    }
  });

  it('should throw 400 for missing snapshot ID', async () => {
    const service = new BackgroundComposerService();

    try {
      await service.startBackgroundComposerFromSnapshot({
        id: '',
        repositories: ['owner/repo'],
        userLogins: [{ username: 'testuser' }],
        workspaceConfig: {},
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).statusCode).toBe(400);
    }
  });

  it('should throw 400 for empty repositories', async () => {
    const service = new BackgroundComposerService();

    try {
      await service.startBackgroundComposerFromSnapshot({
        id: 'test',
        repositories: [],
        userLogins: [{ username: 'testuser' }],
        workspaceConfig: {},
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).statusCode).toBe(400);
    }
  });
});
