import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { registerServiceWorker } from "@/utils/pwa";
import { useEffect } from "react";
import Home from "./pages/Home";
import Compress from "./pages/Compress";
import About from "./pages/About";
import Teams from "./pages/Teams";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate();
  // Removed forced redirect to /login for unauthenticated users

  const location = useLocation();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Smooth scroll to #hero if hash present after navigation
  useEffect(() => {
    if (location.hash === "#hero") {
      // allow route to render
      setTimeout(() => {
        const el = document.getElementById("hero");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-white flex flex-col">
          <PWAInstallPrompt />
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
