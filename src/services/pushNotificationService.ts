/**
 * Push Notification Service
 * Handles browser push notifications for SlimFile
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

/**
 * Check if browser supports push notifications
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request permission to send notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn('Push notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  // Request permission
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('✅ Notification permission granted');
    await subscribeToPushNotifications();
  } else {
    console.log('❌ Notification permission denied');
  }

  return permission;
}

/**
 * Subscribe to push notifications
 */
async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Subscribe to push notifications
      // Note: You'll need to generate VAPID keys for production
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY ||
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmThrerGHR3c0LzaHrLX_-qQNjqvvqZGnP7h0wL6PxJgZ7nqWvCA';

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      console.log('✅ Push subscription created:', subscription);

      // Send subscription to backend
      await sendSubscriptionToBackend(subscription);
    }

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

/**
 * Send subscription to backend
 */
async function sendSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
  const token = localStorage.getItem('jwt');

  if (!token) {
    console.warn('User not authenticated, cannot save push subscription');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subscription)
    });

    if (response.ok) {
      console.log('✅ Push subscription saved to backend');
    } else {
      console.error('Failed to save push subscription to backend');
    }
  } catch (error) {
    console.error('Error sending subscription to backend:', error);
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log('✅ Unsubscribed from push notifications');

      // Notify backend
      await removeSubscriptionFromBackend();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to unsubscribe from notifications:', error);
    return false;
  }
}

/**
 * Remove subscription from backend
 */
async function removeSubscriptionFromBackend(): Promise<void> {
  const token = localStorage.getItem('jwt');

  if (!token) return;

  try {
    await fetch(`${API_BASE_URL}/notifications/unsubscribe`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Push subscription removed from backend');
  } catch (error) {
    console.error('Error removing subscription from backend:', error);
  }
}

/**
 * Show a local notification (doesn't require backend)
 */
export async function showLocalNotification(payload: NotificationPayload): Promise<void> {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/logo.png',
      badge: payload.badge || '/logo.png',
      tag: payload.tag || 'slimfile-notification',
      data: payload.data,
      vibrate: [200, 100, 200],
      requireInteraction: false,
      actions: [
        {
          action: 'open',
          title: 'View'
        },
        {
          action: 'close',
          title: 'Dismiss'
        }
      ]
    });

    console.log('✅ Local notification shown:', payload.title);
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

/**
 * Helper function to convert VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if user has push subscription
 */
export async function hasPushSubscription(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch {
    return false;
  }
}

/**
 * Show notification for compression complete
 */
export async function notifyCompressionComplete(
  fileName: string,
  compressionRatio: number,
  spaceSaved: string
): Promise<void> {
  await showLocalNotification({
    title: '✅ Compression Complete!',
    body: `${fileName} compressed by ${compressionRatio}% (Saved ${spaceSaved})`,
    icon: '/logo.png',
    tag: 'compression-complete',
    data: { type: 'compression', fileName }
  });
}

/**
 * Show notification for achievement unlocked
 */
export async function notifyAchievement(title: string, message: string): Promise<void> {
  await showLocalNotification({
    title: `🏆 ${title}`,
    body: message,
    icon: '/logo.png',
    tag: 'achievement',
    data: { type: 'achievement' }
  });
}

/**
 * Show notification for milestone reached
 */
export async function notifyMilestone(milestone: string): Promise<void> {
  await showLocalNotification({
    title: '🎉 Milestone Reached!',
    body: milestone,
    icon: '/logo.png',
    tag: 'milestone',
    data: { type: 'milestone' }
  });
}
