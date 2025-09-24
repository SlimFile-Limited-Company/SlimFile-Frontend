// Simple authentication utility for SlimFile

export function isAuthenticated(): boolean {
  // Check if a JWT token exists in localStorage
  return typeof window !== 'undefined' && !!localStorage.getItem('jwt');
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
    window.location.href = '/login';
  }
} 
