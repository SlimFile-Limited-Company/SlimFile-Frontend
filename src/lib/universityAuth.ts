/**
 * University Authentication Helpers
 */

const UNIVERSITY_TOKEN_KEY = 'university_token';
const UNIVERSITY_DATA_KEY = 'university_data';

interface UniversityData {
  id: string;
  name: string;
  email: string;
  contactPerson?: string;
  totalFilesCompressed: number;
  totalSpaceSaved: number;
  sessionCount: number;
}

/**
 * Check if university is authenticated
 */
export const isUniversityAuthenticated = (): boolean => {
  const token = localStorage.getItem(UNIVERSITY_TOKEN_KEY);
  return !!token;
};

/**
 * Get university token
 */
export const getUniversityToken = (): string | null => {
  return localStorage.getItem(UNIVERSITY_TOKEN_KEY);
};

/**
 * Get university data
 */
export const getUniversityData = (): UniversityData | null => {
  const data = localStorage.getItem(UNIVERSITY_DATA_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

/**
 * Set university auth data
 */
export const setUniversityAuth = (token: string, university: UniversityData): void => {
  localStorage.setItem(UNIVERSITY_TOKEN_KEY, token);
  localStorage.setItem(UNIVERSITY_DATA_KEY, JSON.stringify(university));
};

/**
 * Clear university auth data
 */
export const clearUniversityAuth = (): void => {
  localStorage.removeItem(UNIVERSITY_TOKEN_KEY);
  localStorage.removeItem(UNIVERSITY_DATA_KEY);
};

/**
 * Logout university
 */
export const universityLogout = (): void => {
  clearUniversityAuth();
  window.location.href = '/university/login';
};

/**
 * Get authorization headers for API calls
 */
export const getUniversityAuthHeaders = (): HeadersInit => {
  const token = getUniversityToken();
  if (!token) return {};

  return {
    'Authorization': `Bearer ${token}`
  };
};
