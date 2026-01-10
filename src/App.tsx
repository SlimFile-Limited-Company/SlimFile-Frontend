import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { NotificationPrompt } from "@/components/NotificationPrompt";
import { registerServiceWorker } from "@/utils/pwa";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";
import { notifyGreeting, getNotificationPermission } from "@/services/pushNotificationService";

const App = () => {
  useEffect(() => {
    registerServiceWorker();

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
      <NotificationPrompt />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
