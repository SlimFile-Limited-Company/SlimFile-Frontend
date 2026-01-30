const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  ownerId: User | string;
  role?: 'owner' | 'editor' | 'viewer';
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  _id: string;
  user: User;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface WorkspaceInvitation {
  _id: string;
  workspaceId: Workspace | string;
  inviterId: User | string;
  inviteeEmail: string;
  role: 'editor' | 'viewer';
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  workspaceId: string;
  senderId: User;
  text: string;
  deleted: boolean;
  deliveredTo: string[];
  readBy: string[];
  replyTo?: {
    _id: string;
    text: string;
    senderId: { _id: string; name: string };
    deleted: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceDetails {
  workspace: Workspace;
  members: WorkspaceMember[];
  pendingInvites: WorkspaceInvitation[];
  currentUserRole: 'owner' | 'editor' | 'viewer';
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('jwt');

  if (!token) {
    console.warn('[WorkspaceService] No JWT token found - user may need to log in');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Handle API errors with better logging
 */
async function handleApiError(response: Response, context: string): Promise<never> {
  const error = await response.json().catch(() => ({ error: 'Unknown error' }));

  console.error(`[WorkspaceService] ${context} failed:`, {
    status: response.status,
    statusText: response.statusText,
    error: error.error,
    message: error.message
  });

  // Check for authentication issues
  if (response.status === 401) {
    console.error('[WorkspaceService] ⚠️ Authentication error - session may be outdated');

    if (error.message?.includes('outdated') || error.message?.includes('log in again')) {
      console.warn('[WorkspaceService] 🔄 User should log out and log in again to refresh session');
    }
  }

  // Check for permission issues
  if (response.status === 403) {
    console.error('[WorkspaceService] ⛔ Permission denied:', error.message);
  }

  throw new Error(error.message || error.error || `${context} failed`);
}

// ============================================
// WORKSPACE CRUD
// ============================================

/**
 * Get all workspaces for the current user
 */
export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await fetch(`${API_BASE_URL}/workspaces`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    return handleApiError(response, 'Get workspaces');
  }

  const data = await response.json();
  return data.workspaces;
}

/**
 * Get workspace details including members
 */
export async function getWorkspace(workspaceId: string): Promise<WorkspaceDetails> {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch workspace');
  }

  const data = await response.json();
  return {
    workspace: data.workspace,
    members: data.members,
    pendingInvites: data.pendingInvites,
    currentUserRole: data.currentUserRole
  };
}

/**
 * Create a new workspace
 */
export async function createWorkspace(name: string, description?: string): Promise<Workspace> {
  const response = await fetch(`${API_BASE_URL}/workspaces`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, description })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create workspace');
  }

  const data = await response.json();
  return data.workspace;
}

/**
 * Update workspace details
 */
export async function updateWorkspace(
  workspaceId: string,
  updates: { name?: string; description?: string }
): Promise<Workspace> {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update workspace');
  }

  const data = await response.json();
  return data.workspace;
}

/**
 * Delete a workspace
 */
export async function deleteWorkspace(workspaceId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete workspace');
  }
}

// ============================================
// INVITATIONS
// ============================================

/**
 * Get pending invitations for the current user
 */
export async function getPendingInvitations(): Promise<WorkspaceInvitation[]> {
  const response = await fetch(`${API_BASE_URL}/workspaces/invitations/pending`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch invitations');
  }

  const data = await response.json();
  return data.invitations;
}

/**
 * Send an invitation to join a workspace
 */
export async function sendInvitation(
  workspaceId: string,
  email: string,
  role: 'editor' | 'viewer'
): Promise<WorkspaceInvitation> {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/invitations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, role })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send invitation');
  }

  const data = await response.json();
  return data.invitation;
}

/**
 * Accept a workspace invitation
 */
export async function acceptInvitation(token: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/workspaces/invitations/${token}/accept`, {
    method: 'POST',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to accept invitation');
  }

  const data = await response.json();
  return data.workspaceId;
}

/**
 * Decline a workspace invitation
 */
export async function declineInvitation(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/workspaces/invitations/${token}/decline`, {
    method: 'POST',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to decline invitation');
  }
}

/**
 * Cancel a pending invitation (owner only)
 */
export async function cancelInvitation(workspaceId: string, invitationId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/invitations/${invitationId}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cancel invitation');
  }
}

// ============================================
// MEMBERS
// ============================================

/**
 * Update a member's role
 */
export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  role: 'editor' | 'viewer'
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/members/${memberId}`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update member role');
  }
}

/**
 * Remove a member from workspace
 */
export async function removeMember(workspaceId: string, memberId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/members/${memberId}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove member');
  }
}

// ============================================
// MESSAGES
// ============================================

/**
 * Get messages for a workspace
 */
export async function getMessages(
  workspaceId: string,
  before?: string,
  limit: number = 50
): Promise<{ messages: Message[]; hasMore: boolean }> {
  const params = new URLSearchParams();
  if (before) params.append('before', before);
  params.append('limit', limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/messages?${params}`,
    { headers: getAuthHeaders() }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch messages');
  }

  const data = await response.json();
  return { messages: data.messages, hasMore: data.hasMore };
}

/**
 * Send a message to a workspace
 */
export async function sendMessage(
  workspaceId: string,
  text: string,
  replyTo?: string
): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ text, replyTo })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }

  const data = await response.json();
  return data.message;
}

/**
 * Delete a message
 */
export async function deleteMessage(workspaceId: string, messageId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/messages/${messageId}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete message');
  }
}

/**
 * Mark a message as delivered
 */
export async function markMessageAsDelivered(workspaceId: string, messageId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/messages/${messageId}/delivered`,
    {
      method: 'POST',
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to mark message as delivered');
  }
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(workspaceId: string, messageId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/messages/${messageId}/read`,
    {
      method: 'POST',
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to mark message as read');
  }
}

// ============================================
// UTILITIES
// ============================================

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'owner':
      return 'bg-purple-100 text-purple-700';
    case 'editor':
      return 'bg-blue-100 text-blue-700';
    case 'viewer':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

/**
 * Format date for display
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
