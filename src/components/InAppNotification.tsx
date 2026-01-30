import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationData {
  id: string;
  senderName: string;
  senderPicture?: string;
  message: string;
  workspaceId: string;
  workspaceName?: string;
  timestamp: number;
}

interface NotificationContextType {
  showNotification: (data: Omit<NotificationData, 'id' | 'timestamp'>) => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useInAppNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useInAppNotification must be used within NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const navigate = useNavigate();

  const showNotification = useCallback((data: Omit<NotificationData, 'id' | 'timestamp'>) => {
    const notification: NotificationData = {
      ...data,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const handleNotificationClick = (notification: NotificationData) => {
    clearNotification(notification.id);
    navigate(`/workspaces/${notification.workspaceId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, clearNotification, clearAll }}>
      {children}

      {/* Notification Stack */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="pointer-events-auto animate-in slide-in-from-top-2 fade-in duration-300"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div
              onClick={() => handleNotificationClick(notification)}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              style={{
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Avatar */}
              <Avatar className="h-12 w-12 ring-2 ring-red-100 flex-shrink-0">
                <AvatarImage src={notification.senderPicture} />
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-semibold">
                  {getInitials(notification.senderName)}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">
                    {notification.senderName}
                  </p>
                  {notification.workspaceName && (
                    <>
                      <span className="text-gray-300">•</span>
                      <p className="text-sm text-gray-500 truncate">
                        {notification.workspaceName}
                      </p>
                    </>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotification(notification.id);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>

              {/* Message icon indicator */}
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1.5 shadow-lg">
                <MessageCircle className="h-3 w-3 text-white fill-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

// Export a standalone function for use outside React components
let notificationHandler: ((data: Omit<NotificationData, 'id' | 'timestamp'>) => void) | null = null;

export function setNotificationHandler(handler: typeof notificationHandler) {
  notificationHandler = handler;
}

export function triggerInAppNotification(data: Omit<NotificationData, 'id' | 'timestamp'>) {
  if (notificationHandler) {
    notificationHandler(data);
  }
}
