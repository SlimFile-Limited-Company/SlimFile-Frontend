// Browser notification service for inactive user reminders

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

export class NotificationService {
  private static LAST_COMPRESSION_KEY = 'slimfile_last_compression';
  private static NOTIFICATION_PERMISSION_KEY = 'slimfile_notification_permission_asked';
  private static CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  // Request notification permission
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      localStorage.setItem(this.NOTIFICATION_PERMISSION_KEY, 'true');
      return permission === 'granted';
    }

    return false;
  }

  // Show browser notification
  static showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = '/compress';
        notification.close();
      };

      return notification;
    }
    return null;
  }

  // Update last compression timestamp
  static updateLastCompression() {
    localStorage.setItem(this.LAST_COMPRESSION_KEY, Date.now().toString());
  }

  // Get days since last compression
  static getDaysSinceLastCompression(): number {
    const lastCompression = localStorage.getItem(this.LAST_COMPRESSION_KEY);
    if (!lastCompression) return Infinity;

    const daysSince = (Date.now() - parseInt(lastCompression)) / (1000 * 60 * 60 * 24);
    return Math.floor(daysSince);
  }

  // Check if user has been inactive for a week
  static shouldSendWeeklyReminder(): boolean {
    const daysSince = this.getDaysSinceLastCompression();
    return daysSince >= 7;
  }

  // Send weekly reminder if user is inactive
  static async checkAndSendWeeklyReminder() {
    if (this.shouldSendWeeklyReminder()) {
      const hasPermission = await this.requestPermission();
      if (hasPermission) {
        this.showNotification('SlimFile Weekly Reminder', {
          body: "It's been a week since you last compressed files. Come back and save some space!",
          tag: 'weekly-reminder',
          requireInteraction: false
        });
      }
    }
  }

  // Initialize notification service
  static init() {
    // Check if user is logged in
    const token = localStorage.getItem('jwt');
    if (!token) return;

    // Request permission if not already asked
    const hasAskedPermission = localStorage.getItem(this.NOTIFICATION_PERMISSION_KEY);
    if (!hasAskedPermission && Notification.permission === 'default') {
      // Wait a bit before asking for permission (better UX)
      setTimeout(() => {
        this.requestPermission();
      }, 10000); // Ask after 10 seconds
    }

    // Check for weekly reminder on app load
    this.checkAndSendWeeklyReminder();

    // Set up periodic check (every 24 hours)
    setInterval(() => {
      this.checkAndSendWeeklyReminder();
    }, this.CHECK_INTERVAL);
  }

  // Send achievement notification
  static sendAchievementNotification(title: string, message: string) {
    this.showNotification(`🏆 ${title}`, {
      body: message,
      tag: 'achievement',
      requireInteraction: true
    });
  }

  // Send milestone notification
  static sendMilestoneNotification(milestone: string) {
    this.showNotification('🎉 Milestone Reached!', {
      body: milestone,
      tag: 'milestone',
      requireInteraction: true
    });
  }

  // Fetch and check for server-side notifications
  static async checkServerNotifications() {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/notifications/unread`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Show browser notifications for unread server notifications
        if (data.notifications && data.notifications.length > 0) {
          data.notifications.forEach((notif: any) => {
            if (notif.type === 'achievement') {
              this.sendAchievementNotification(notif.title, notif.message);
            } else if (notif.type === 'milestone') {
              this.sendMilestoneNotification(notif.message);
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to check server notifications:', error);
    }
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      NotificationService.init();
    });
  } else {
    NotificationService.init();
  }
}
