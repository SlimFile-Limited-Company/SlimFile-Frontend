import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { CookieBanner } from "@/components/CookieBanner";
import { registerServiceWorker } from "@/utils/pwa";
import { useEffect } from "react";
import { isAuthenticated, validateToken } from "@/lib/auth";
import { notifyGreeting, getNotificationPermission, requestNotificationPermission } from "@/services/pushNotificationService";

const App = () => {
  useEffect(() => {
    registerServiceWorker();

    // Validate token on app mount (check if it's expired)
    if (isAuthenticated()) {
      validateToken(); // This will auto-logout if token is expired
    }

    // Automatically enable push notifications for authenticated users
    const autoEnableNotifications = async () => {
      if (!isAuthenticated()) {
        return; // Only for authenticated users
      }

      const currentPermission = getNotificationPermission();

      // Silently request permission in background
      // Note: Browser will show its native permission dialog (unavoidable for security)
      if (currentPermission === 'default') {
        // Only ask once per session to avoid being annoying
        const hasAskedThisSession = sessionStorage.getItem('notificationPermissionAsked');
        if (!hasAskedThisSession) {
          // Wait for page to fully load before requesting
          setTimeout(async () => {
            await requestNotificationPermission();
            sessionStorage.setItem('notificationPermissionAsked', 'true');
          }, 5000); // 5 seconds - less intrusive
        }
      } else if (currentPermission === 'granted') {
        // Permission already granted - ensure subscription is active (silent)
        requestNotificationPermission();
      }
    };

    autoEnableNotifications();

    // Show greeting notification if user is authenticated and has granted permission
    const showGreetingNotification = async () => {
      const token = localStorage.getItem('jwt');

      // Check if we should show greeting (only once per session)
      const greetingShownToday = sessionStorage.getItem('greetingShown');
      const today = new Date().toDateString();

      if (isAuthenticated() && !greetingShownToday && getNotificationPermission() === 'granted') {
        try {
          // Fetch user data
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
          const response = await fetch(`${API_BASE_URL}/protected/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
            const data = await response.json();
            const userName = data.user?.name || 'User';

            // Wait a bit before showing greeting (let the page load first)
            setTimeout(() => {
              notifyGreeting(userName);
              sessionStorage.setItem('greetingShown', today);
            }, 3000);
          }
        } catch (error) {
          console.error('Error showing greeting notification:', error);
        }
      }
    };

    showGreetingNotification();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PWAInstallPrompt />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default App;
