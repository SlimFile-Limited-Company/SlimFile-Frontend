import { useCollaboration } from '@/contexts/CollaborationContext';
import { Activity as ActivityIcon, Clock } from 'lucide-react';

export default function ActivityFeed() {
  const { activities } = useCollaboration();

  const formatTimestamp = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <ActivityIcon className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
      </div>

      {/* Activity List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-4">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No activity yet</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* User Color Indicator */}
              <div
                className="w-1 h-full rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: activity.userColor }}
              />

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900">
                  <span className="font-medium" style={{ color: activity.userColor }}>
                    {activity.userName}
                  </span>{' '}
                  <span className="text-gray-600">{activity.description}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
