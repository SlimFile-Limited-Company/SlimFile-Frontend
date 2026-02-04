/**
 * API Client utility with automatic authentication error handling
 * Wraps fetch calls and handles 401 errors globally
 */

import { getToken, handleAuthError, isTokenExpired } from '@/lib/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

export interface ApiRequestOptions extends RequestInit {
  skipAuthCheck?: boolean;
  skipErrorHandling?: boolean;
}

/**
 * Enhanced fetch wrapper with automatic auth handling
 */
export async function apiFetch(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  const { skipAuthCheck, skipErrorHandling, ...fetchOptions } = options;

  // Build full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Check token expiration before making request (unless skipped)
  if (!skipAuthCheck) {
    if (isTokenExpired()) {
      handleAuthError('Token expired');
      throw new Error('Authentication token expired');
    }
  }

  // Add auth header if token exists
  const token = getToken();
  const headers = new Headers(fetchOptions.headers);

  if (token && !skipAuthCheck) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Make the request
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 errors globally (unless error handling is skipped)
    if (!skipErrorHandling && response.status === 401) {
      console.error('Received 401 Unauthorized response');
      handleAuthError('Unauthorized - session expired');
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    // Network errors or other fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
}

/**
 * Convenience method for GET requests
 */
export async function apiGet<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const response = await apiFetch(endpoint, {
    ...options,
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || `GET ${endpoint} failed`);
  }

  return response.json();
}

/**
 * Convenience method for POST requests
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options: ApiRequestOptions = {}
): Promise<T> {
  const response = await apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || `POST ${endpoint} failed`);
  }

  return response.json();
}

/**
 * Convenience method for PATCH requests
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any,
  options: ApiRequestOptions = {}
): Promise<T> {
  const response = await apiFetch(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || `PATCH ${endpoint} failed`);
  }

  return response.json();
}

/**
 * Convenience method for DELETE requests
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const response = await apiFetch(endpoint, {
    ...options,
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || `DELETE ${endpoint} failed`);
  }

  // DELETE might return empty response
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

/**
 * Compress a file using the SlimFile compression API
 * Returns a new File object with the compressed data
 */
export interface CompressResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  spaceSaved: number;
  compressionRatio: number;
}

export async function compressFile(file: File): Promise<CompressResult> {
  const token = localStorage.getItem('jwt');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/compress`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Compression failed' }));
    throw new Error(error.error || 'Failed to compress file');
  }

  // Get the compressed file as blob
  const blob = await response.blob();

  // Extract filename from Content-Disposition header or use original
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = file.name;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
    if (match) {
      filename = match[1];
    }
  }

  // Create a new File object with the compressed data
  const compressedFile = new File([blob], filename, { type: blob.type || file.type });

  const originalSize = file.size;
  const compressedSize = compressedFile.size;
  const spaceSaved = originalSize - compressedSize;
  const compressionRatio = originalSize > 0 ? Math.round((spaceSaved / originalSize) * 100) : 0;

  return {
    file: compressedFile,
    originalSize,
    compressedSize,
    spaceSaved,
    compressionRatio
  };
}
