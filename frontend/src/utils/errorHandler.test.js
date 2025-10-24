import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleError } from './errorHandler';

describe('errorHandler', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();
    vi.clearAllMocks();
    // Mock console.error to avoid cluttering test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Network Errors', () => {
    it('should redirect to /error/network for "Failed to fetch" error', () => {
      const error = new Error('Failed to fetch');
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/network');
      expect(result).toBe(true);
    });

    it('should redirect to /error/network for "Network Error"', () => {
      const error = new Error('Network Error');
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/network');
      expect(result).toBe(true);
    });

    it('should redirect to /error/network when offline', () => {
      const originalOnLine = navigator.onLine;
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });

      const error = new Error('Some error');
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/network');
      expect(result).toBe(true);

      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: originalOnLine
      });
    });
  });

  describe('HTTP Error Codes', () => {
    it('should redirect to /error/401 for 401 status', () => {
      const error = {
        response: { status: 401 },
        message: 'Unauthorized'
      };
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/401');
      expect(result).toBe(true);
    });

    it('should redirect to /error/403 for 403 status', () => {
      const error = {
        response: { status: 403 },
        message: 'Forbidden'
      };
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/403');
      expect(result).toBe(true);
    });

    it('should redirect to /error/404 for 404 status', () => {
      const error = {
        response: { status: 404 },
        message: 'Not Found'
      };
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/404');
      expect(result).toBe(true);
    });

    it('should redirect to /error/500 for 500 status', () => {
      const error = {
        response: { status: 500 },
        message: 'Internal Server Error'
      };
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/500');
      expect(result).toBe(true);
    });

    it('should redirect to /error/503 for 503 status', () => {
      const error = {
        response: { status: 503 },
        message: 'Service Unavailable'
      };
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/503');
      expect(result).toBe(true);
    });
  });

  describe('skipValidationErrors option', () => {
    it('should NOT redirect for 400 when skipValidationErrors is true', () => {
      const error = {
        response: { status: 400 },
        message: 'Bad Request'
      };
      const result = handleError(error, mockNavigate, { skipValidationErrors: true });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should NOT redirect for 401 when skipValidationErrors is true', () => {
      const error = {
        response: { status: 401 },
        message: 'Unauthorized'
      };
      const result = handleError(error, mockNavigate, { skipValidationErrors: true });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should NOT redirect for 409 when skipValidationErrors is true', () => {
      const error = {
        response: { status: 409 },
        message: 'Conflict'
      };
      const result = handleError(error, mockNavigate, { skipValidationErrors: true });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should redirect for 400 when skipValidationErrors is false', () => {
      const error = {
        response: { status: 400 },
        message: 'Bad Request'
      };
      const result = handleError(error, mockNavigate, { skipValidationErrors: false });

      expect(mockNavigate).toHaveBeenCalledWith('/error/404');
      expect(result).toBe(true);
    });

    it('should still redirect for 500 even when skipValidationErrors is true', () => {
      const error = {
        response: { status: 500 },
        message: 'Internal Server Error'
      };
      const result = handleError(error, mockNavigate, { skipValidationErrors: true });

      expect(mockNavigate).toHaveBeenCalledWith('/error/500');
      expect(result).toBe(true);
    });

    it('should still redirect for network errors even when skipValidationErrors is true', () => {
      const error = new Error('Failed to fetch');
      const result = handleError(error, mockNavigate, { skipValidationErrors: true });

      expect(mockNavigate).toHaveBeenCalledWith('/error/network');
      expect(result).toBe(true);
    });
  });

  describe('Fallback behavior', () => {
    it('should redirect other 4xx errors to /error/404', () => {
      const error = {
        response: { status: 422 },
        message: 'Unprocessable Entity'
      };
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/404');
      expect(result).toBe(true);
    });

    it('should redirect other 5xx errors to /error/500', () => {
      const error = {
        response: { status: 502 },
        message: 'Bad Gateway'
      };
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/500');
      expect(result).toBe(true);
    });

    it('should redirect unknown errors to /error/500', () => {
      const error = new Error('Unknown error');
      const result = handleError(error, mockNavigate);

      expect(mockNavigate).toHaveBeenCalledWith('/error/500');
      expect(result).toBe(true);
    });
  });

  describe('Error logging', () => {
    it('should log all errors to console.error', () => {
      const error = new Error('Test error');
      handleError(error, mockNavigate);

      expect(console.error).toHaveBeenCalledWith('Error caught:', error);
    });
  });
});
