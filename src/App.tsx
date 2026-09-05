import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { CookieBanner } from "@/components/CookieBanner";
import ChatAssistant from "@/components/ChatAssistant";
import { registerServiceWorker } from "@/utils/pwa";
import { useEffect, useState } from "react";
import { isAuthenticated, validateToken } from "@/lib/auth";
import { getNotificationPermission, requestNotificationPermission, notifyGreeting } from "@/services/pushNotificationService";

const App = () => {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Detect if loaded in iframe
    setIsInIframe(window.self !== window.top);

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
  }, []);

  return (
    <div className={`min-h-screen bg-white flex flex-col ${isInIframe ? 'pb-0' : 'pb-16 md:pb-0'}`}>
      {!isInIframe && <PWAInstallPrompt />}
      {!isInIframe && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isInIframe && <Footer />}
      {!isInIframe && <CookieBanner />}
      {!isInIframe && <ChatAssistant />}
    </div>
  );
};

export default App;
