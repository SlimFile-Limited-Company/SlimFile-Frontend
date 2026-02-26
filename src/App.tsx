import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { CookieBanner } from "@/components/CookieBanner";
import { GreetingBanner } from "@/components/GreetingBanner";
import { registerServiceWorker } from "@/utils/pwa";
import { useEffect, useState } from "react";
import { isAuthenticated, validateToken } from "@/lib/auth";
import { getNotificationPermission, requestNotificationPermission } from "@/services/pushNotificationService";

const App = () => {
  const [greetingUser, setGreetingUser] = useState<string | null>(null);

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

    // Show in-app greeting banner once per session for authenticated users
    const showGreetingBanner = async () => {
      if (!isAuthenticated()) return;
      const greetingShown = sessionStorage.getItem('greetingShown');
      if (greetingShown) return;

      try {
        const token = localStorage.getItem('jwt');
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
        const response = await fetch(`${API_BASE_URL}/protected/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const userName = data.user?.name || 'User';
          setTimeout(() => {
            setGreetingUser(userName);
            sessionStorage.setItem('greetingShown', new Date().toDateString());
          }, 500);
        }
      } catch {
        // silently fail
      }
    };

    showGreetingBanner();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16 md:pb-0">
      <PWAInstallPrompt />
      {greetingUser && (
        <GreetingBanner userName={greetingUser} onDismiss={() => setGreetingUser(null)} />
      )}
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
