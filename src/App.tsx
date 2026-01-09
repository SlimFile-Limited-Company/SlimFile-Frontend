import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { registerServiceWorker } from "@/utils/pwa";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PWAInstallPrompt />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
