import { useCollaboration } from '@/contexts/CollaborationContext';
import { Users, Crown } from 'lucide-react';

export default function OnlineUsers() {
  const { currentUser, onlineUsers, session } = useCollaboration();

  const allUsers = currentUser ? [currentUser, ...onlineUsers] : onlineUsers;

  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">
            Online ({allUsers.length})
          </h3>
        </div>
      </div>

      {/* User List */}
      <div className="space-y-2">
        {allUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: user.color }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                  {user.id === currentUser?.id && (
                    <span className="text-xs text-gray-500 ml-1">(You)</span>
                  )}
                </p>
                {user.id === session?.createdBy && (
                  <Crown className="w-3 h-3 text-yellow-500" title="Session Owner" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                Page {user.currentPage}
              </p>
            </div>

            {/* Activity Indicator */}
            <div className="w-2 h-2 rounded-full bg-green-500" title="Online" />
          </div>
        ))}
      </div>

      {allUsers.length === 0 && (
        <div className="text-center py-4">
          <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No one else is here yet</p>
          <p className="text-xs text-gray-500 mt-1">Share the session link to invite others</p>
        </div>
      )}
    </div>
  );
}
