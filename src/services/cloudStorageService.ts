const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com';

export type CloudProvider = 'google-drive' | 'dropbox' | 'onedrive';

export interface CloudStorageConnection {
  provider: CloudProvider;
  isConnected: boolean;
  email?: string;
  connectedAt?: string;
}

export interface CloudUploadResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  webViewLink?: string;
  provider: CloudProvider;
}

/**
 * Check if user has connected a specific cloud storage provider
 */
export async function checkCloudConnection(
  provider: CloudProvider
): Promise<{ isConnected: boolean; email?: string }> {
  const token = localStorage.getItem('jwt');

  if (!token) {
    return { isConnected: false };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/cloud/check/${provider}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check cloud connection');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking cloud connection:', error);
    return { isConnected: false };
  }
}

/**
 * Get all cloud storage connections for the user
 */
export async function getAllCloudConnections(): Promise<CloudStorageConnection[]> {
  const token = localStorage.getItem('jwt');

  if (!token) {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/cloud/connections`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cloud connections');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cloud connections:', error);
    return [];
  }
}

/**
 * Initiate OAuth flow for a cloud storage provider
 */
export function initiateCloudOAuth(provider: CloudProvider, redirectUrl?: string): void {
  const currentUrl = redirectUrl || window.location.href;
  const authUrl = `${API_BASE_URL}/api/cloud/auth/${provider}?redirect=${encodeURIComponent(currentUrl)}`;
  window.location.href = authUrl;
}

/**
 * Upload a file to cloud storage
 */
export async function uploadToCloud(
  file: File,
  provider: CloudProvider,
  fileName?: string
): Promise<CloudUploadResponse> {
  const token = localStorage.getItem('jwt');

  if (!token) {
    throw new Error('Authentication required');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName || file.name);
  formData.append('provider', provider);

  try {
    const response = await fetch(`${API_BASE_URL}/api/cloud/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload to cloud storage');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading to cloud:', error);
    throw error;
  }
}

/**
 * Disconnect a cloud storage provider
 */
export async function disconnectCloudProvider(provider: CloudProvider): Promise<boolean> {
  const token = localStorage.getItem('jwt');

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/cloud/disconnect/${provider}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to disconnect cloud provider');
    }

    return true;
  } catch (error) {
    console.error('Error disconnecting cloud provider:', error);
    throw error;
  }
}

/**
 * Get readable name for cloud provider
 */
export function getProviderName(provider: CloudProvider): string {
  const names: Record<CloudProvider, string> = {
    'google-drive': 'Google Drive',
    'dropbox': 'Dropbox',
    'onedrive': 'OneDrive'
  };
  return names[provider];
}

/**
 * Convert file to base64 (for storing in session)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Convert base64 back to File object
 */
export function base64ToFile(base64: string, fileName: string, fileType: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || fileType;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}
