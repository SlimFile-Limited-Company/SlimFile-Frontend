// Authentication utility for SlimFile

export function isAuthenticated(): boolean {
  // Check if a JWT token exists in localStorage
  return typeof window !== 'undefined' && !!localStorage.getItem('jwt');
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt');
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', token);
  }
}

export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
  }
}

export function logout(redirectToLogin = true) {
  if (typeof window !== 'undefined') {
    // Clear token
    clearToken();

    // Clear any session storage
    sessionStorage.clear();

    // Redirect to login if requested
    if (redirectToLogin) {
      // Store current path for redirect after login (optional)
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }

      window.location.href = '/login';
    }
  }
}

/**
 * Handle authentication errors (401 responses)
 * Automatically logs out the user and redirects to login
 */
export function handleAuthError(error?: string): void {
  console.error('Authentication error:', error || 'Token expired or invalid');

  // Show a brief message to the user
  if (typeof window !== 'undefined') {
    // You can replace this with a toast notification if you have one
    alert('Your session has expired. Please log in again.');
  }

  // Logout and redirect
  logout(true);
}

/**
 * Check if a token is potentially expired by decoding the JWT
 * Note: This is a basic check and doesn't verify signature
 */
export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    // Decode JWT payload (middle part of token)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Check expiration time (exp is in seconds, Date.now() is in milliseconds)
    if (payload.exp) {
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        console.warn('Token has expired');
      }
      return isExpired;
    }

    // If no exp field, assume it's valid
    return false;
  } catch (error) {
    console.error('Error decoding token:', error);
    // If we can't decode it, assume it's invalid
    return true;
  }
}

/**
 * Validate token before making API calls
 * Returns true if valid, false if expired (and triggers logout)
 */
export function validateToken(): boolean {
  if (!isAuthenticated()) {
    return false;
  }

  if (isTokenExpired()) {
    handleAuthError('Token expired');
    return false;
  }

  return true;
} 
